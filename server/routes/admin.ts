import { type Express, Router, Request, Response } from 'express';
import { requireAdmin } from '../lib/auth';
import { supabaseAdmin } from '../lib/supabase';
import { supabaseRemote } from '../lib/supabase-remote';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export function registerAdminRoutes(app: Express) {
  const router = Router();
  router.use(requireAdmin);

  // =============================================
  // DASHBOARD
  // =============================================
  router.get('/dashboard', async (req: Request, res: Response) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoISO = sevenDaysAgo.toISOString();

      const [
        usersResult,
        productsResult,
        coursesResult,
        competitorStoresResult,
        activePlansResult,
        recentSignupsResult,
        freeUsersResult,
        proUsersResult,
        leadsResult,
        suppliersResult,
        shopifyStoresResult,
      ] = await Promise.all([
        supabaseAdmin
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .is('internal_role', null),
        supabaseAdmin
          .from('products')
          .select('id', { count: 'exact', head: true }),
        supabaseAdmin
          .from('courses')
          .select('id', { count: 'exact', head: true }),
        supabaseAdmin
          .from('competitor_stores')
          .select('id', { count: 'exact', head: true }),
        supabaseAdmin
          .from('subscription_plans')
          .select('id', { count: 'exact', head: true })
          .eq('active', true),
        supabaseAdmin
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .is('internal_role', null)
          .gte('created_at', sevenDaysAgoISO),
        supabaseAdmin
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .is('internal_role', null)
          .eq('account_type', 'free'),
        supabaseAdmin
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .is('internal_role', null)
          .eq('account_type', 'pro'),
        supabaseAdmin
          .from('leads')
          .select('id', { count: 'exact', head: true }),
        supabaseAdmin
          .from('suppliers')
          .select('id', { count: 'exact', head: true }),
        supabaseAdmin
          .from('shopify_stores')
          .select('id', { count: 'exact', head: true }),
      ]);

      return res.json({
        totalExternalUsers: usersResult.count ?? 0,
        totalProducts: productsResult.count ?? 0,
        totalCourses: coursesResult.count ?? 0,
        totalCompetitorStores: competitorStoresResult.count ?? 0,
        activeSubscriptionPlans: activePlansResult.count ?? 0,
        recentSignups: recentSignupsResult.count ?? 0,
        usersByAccountType: {
          free: freeUsersResult.count ?? 0,
          pro: proUsersResult.count ?? 0,
        },
        totalLeads: leadsResult.count ?? 0,
        totalSuppliers: suppliersResult.count ?? 0,
        totalShopifyStores: shopifyStoresResult.count ?? 0,
      });
    } catch (error) {
      console.error('Error in GET /api/admin/dashboard:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================
  // CATEGORIES
  // =============================================
  router.get('/categories', async (req: Request, res: Response) => {
    try {
      const parentCategoryId = req.query.parent_category_id as string | undefined;
      const trending = req.query.trending as string | undefined;
      const search = req.query.search as string | undefined;

      let query = supabaseRemote.from('categories').select('*');

      if (parentCategoryId === 'null' || parentCategoryId === '') {
        query = query.is('parent_category_id', null);
      } else if (parentCategoryId) {
        query = query.eq('parent_category_id', parentCategoryId);
      }

      if (trending === 'true') {
        query = query.eq('trending', true);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%,description.ilike.%${search}%`);
      }

      query = query.order('growth_percentage', { ascending: false, nullsFirst: false }).order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const { data: productCounts } = await supabaseRemote
        .from('products')
        .select('category_id');

      const countMap: Record<string, number> = {};
      if (productCounts) {
        for (const p of productCounts) {
          if (p.category_id) {
            countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
          }
        }
      }

      const categories = (data || []).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        thumbnail: cat.thumbnail,
        parent_category_id: cat.parent_category_id,
        trending: cat.trending || false,
        product_count: countMap[cat.id] || cat.product_count || 0,
        avg_profit_margin: cat.avg_profit_margin ? parseFloat(cat.avg_profit_margin) : null,
        growth_percentage: cat.growth_percentage ? parseFloat(cat.growth_percentage) : null,
        created_at: cat.created_at,
        updated_at: cat.updated_at,
      }));

      return res.json({
        categories,
        total: categories.length,
      });
    } catch (error) {
      console.error('Unexpected error fetching categories:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/categories', async (req: Request, res: Response) => {
    try {
      const {
        name,
        slug,
        description,
        image,
        thumbnail,
        parent_category_id,
        trending,
        growth_percentage,
      } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Missing required field: name' });
      }

      const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const { data: existing } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', generatedSlug)
        .limit(1);

      if (existing && existing.length > 0) {
        return res.status(400).json({ error: 'Category with this slug already exists' });
      }

      const { data: result, error } = await supabaseAdmin
        .from('categories')
        .insert({
          name,
          slug: generatedSlug,
          description: description || null,
          image: image || null,
          thumbnail: thumbnail || null,
          parent_category_id: parent_category_id || null,
          trending: trending || false,
          growth_percentage: growth_percentage || null,
        })
        .select()
        .single();

      if (error || !result) {
        console.error('Error creating category:', error);
        return res.status(500).json({ error: 'Failed to create category' });
      }

      return res.status(201).json({ category: result });
    } catch (error) {
      console.error('Unexpected error creating category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/categories/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Category not found' });
      }

      let parentCategory = null;
      if (data.parent_category_id) {
        const { data: parentResult } = await supabaseAdmin
          .from('categories')
          .select('id, name, slug')
          .eq('id', data.parent_category_id)
          .single();

        if (parentResult) {
          parentCategory = {
            id: parentResult.id,
            name: parentResult.name,
            slug: parentResult.slug,
          };
        }
      }

      const { data: subcategories } = await supabaseRemote
        .from('categories')
        .select('*')
        .eq('parent_category_id', id)
        .order('name', { ascending: true });

      const category = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        thumbnail: data.thumbnail,
        parent_category_id: data.parent_category_id,
        parent_category: parentCategory,
        trending: data.trending || false,
        product_count: data.product_count || 0,
        avg_profit_margin: data.avg_profit_margin ? parseFloat(data.avg_profit_margin) : null,
        growth_percentage: data.growth_percentage ? parseFloat(data.growth_percentage) : null,
        created_at: data.created_at,
        updated_at: data.updated_at,
        subcategories: (subcategories || []).map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          image: sub.image,
          thumbnail: sub.thumbnail,
          parent_category_id: sub.parent_category_id,
          trending: sub.trending || false,
          product_count: sub.product_count || 0,
          avg_profit_margin: sub.avg_profit_margin ? parseFloat(sub.avg_profit_margin) : null,
          growth_percentage: sub.growth_percentage ? parseFloat(sub.growth_percentage) : null,
          created_at: sub.created_at,
          updated_at: sub.updated_at,
        })),
      };

      return res.json({ category });
    } catch (error) {
      console.error('Unexpected error fetching category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/categories/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        name,
        slug,
        description,
        image,
        thumbnail,
        parent_category_id,
        trending,
        growth_percentage,
      } = req.body;

      const generatedSlug = slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined);

      if (generatedSlug) {
        const { data: existing } = await supabaseAdmin
          .from('categories')
          .select('id')
          .eq('slug', generatedSlug)
          .neq('id', id)
          .limit(1);

        if (existing && existing.length > 0) {
          return res.status(400).json({ error: 'Category with this slug already exists' });
        }
      }

      const updateData: Record<string, any> = {};

      if (name !== undefined) updateData.name = name;
      if (generatedSlug !== undefined) updateData.slug = generatedSlug;
      if (description !== undefined) updateData.description = description;
      if (image !== undefined) updateData.image = image;
      if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
      if (parent_category_id !== undefined) updateData.parent_category_id = parent_category_id || null;
      if (trending !== undefined) updateData.trending = trending;
      if (growth_percentage !== undefined) updateData.growth_percentage = growth_percentage;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updateData.updated_at = new Date().toISOString();

      const { data: result, error } = await supabaseAdmin
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !result) {
        return res.status(500).json({ error: 'Failed to update category' });
      }

      return res.json({ category: result });
    } catch (error) {
      console.error('Unexpected error updating category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/categories/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data: subcategories } = await supabaseRemote
        .from('categories')
        .select('id')
        .eq('parent_category_id', id)
        .limit(1);

      if (subcategories && subcategories.length > 0) {
        return res.status(400).json({ error: 'Cannot delete category with subcategories. Please delete or reassign subcategories first.' });
      }

      const { data: products } = await supabaseRemote
        .from('products')
        .select('id')
        .eq('category_id', id)
        .limit(1);

      if (products && products.length > 0) {
        return res.status(400).json({ error: 'Cannot delete category with products. Please reassign or delete products first.' });
      }

      await supabaseRemote.from('categories').delete().eq('id', id);

      return res.json({ success: true });
    } catch (error) {
      console.error('Unexpected error deleting category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================
  // COMPETITOR STORES
  // =============================================
  function mapCompetitorStore(item: any) {
    const cat = item.categories;
    return {
      id: item.id,
      name: item.name,
      url: item.url,
      logo: item.logo,
      category_id: item.category_id,
      category: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : null,
      country: item.country,
      monthly_traffic: item.monthly_traffic,
      monthly_revenue: item.monthly_revenue ? parseFloat(item.monthly_revenue) : null,
      growth: parseFloat(item.growth),
      products_count: item.products_count,
      rating: item.rating ? parseFloat(item.rating) : null,
      verified: item.verified,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  }

  router.get('/competitor-stores', async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.category_id as string | undefined;
      const country = req.query.country as string | undefined;
      const search = req.query.search as string | undefined;
      const verified = req.query.verified as string | undefined;
      const page = parseInt((req.query.page as string) || '1');
      const pageSize = parseInt((req.query.pageSize as string) || '50');
      const sortBy = (req.query.sortBy as string) || 'created_at';
      const sortOrder = (req.query.sortOrder as string) || 'desc';

      let countQuery = supabaseRemote.from('competitor_stores').select('*', { count: 'exact', head: true });
      let dataQuery = supabaseRemote.from('competitor_stores').select('*, categories(id, name, slug)');

      if (verified !== undefined) {
        countQuery = countQuery.eq('verified', verified === 'true');
        dataQuery = dataQuery.eq('verified', verified === 'true');
      }
      if (categoryId) {
        countQuery = countQuery.eq('category_id', categoryId);
        dataQuery = dataQuery.eq('category_id', categoryId);
      }
      if (country) {
        countQuery = countQuery.eq('country', country);
        dataQuery = dataQuery.eq('country', country);
      }
      if (search) {
        countQuery = countQuery.or(`name.ilike.%${search}%,url.ilike.%${search}%`);
        dataQuery = dataQuery.or(`name.ilike.%${search}%,url.ilike.%${search}%`);
      }

      const allowedSortColumns: Record<string, string> = {
        name: 'name',
        monthly_revenue: 'monthly_revenue',
        monthly_traffic: 'monthly_traffic',
        growth: 'growth',
        rating: 'rating',
        created_at: 'created_at',
      };
      const orderCol = allowedSortColumns[sortBy] || 'created_at';
      dataQuery = dataQuery.order(orderCol, { ascending: sortOrder === 'asc', nullsFirst: false });

      const offset = (page - 1) * pageSize;
      dataQuery = dataQuery.range(offset, offset + pageSize - 1);

      const [{ count: totalCount }, { data, error }] = await Promise.all([countQuery, dataQuery]);

      if (error) {
        console.error('Error fetching competitor stores:', error);
        return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
      }

      const stores = (data || []).map(mapCompetitorStore);

      return res.json({ stores, totalCount: totalCount || 0 });
    } catch (error: any) {
      console.error('Unexpected error in GET admin competitor stores:', error);
      return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
  });

  router.post('/competitor-stores', async (req: Request, res: Response) => {
    try {
      const {
        name,
        url,
        logo,
        category_id,
        country,
        monthly_traffic,
        monthly_revenue,
        growth,
        products_count,
        rating,
        verified,
      } = req.body;

      if (!name || !url) {
        return res.status(400).json({ error: 'Name and URL are required' });
      }

      const { data: inserted, error: insertError } = await supabaseAdmin
        .from('competitor_stores')
        .insert({
          name,
          url,
          logo: logo || null,
          category_id: category_id || null,
          country: country || null,
          monthly_traffic: monthly_traffic || 0,
          monthly_revenue: monthly_revenue || null,
          growth: growth || 0,
          products_count: products_count || null,
          rating: rating || null,
          verified: verified || false,
        })
        .select('*, categories(id, name, slug)')
        .single();

      if (insertError || !inserted) {
        console.error('Error creating competitor store:', insertError);
        return res.status(500).json({ error: 'An unexpected error occurred', details: insertError?.message });
      }

      const store = mapCompetitorStore(inserted);

      return res.status(201).json({ store });
    } catch (error: any) {
      console.error('Unexpected error in POST admin competitor stores:', error);
      return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
  });

  router.get('/competitor-stores/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('competitor_stores')
        .select('*, categories(id, name, slug)')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Competitor store not found' });
      }

      const store = mapCompetitorStore(data);

      return res.json({ store });
    } catch (error: any) {
      console.error('Unexpected error in GET competitor store:', error);
      return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
  });

  router.patch('/competitor-stores/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        name,
        url,
        logo,
        category_id,
        country,
        monthly_traffic,
        monthly_revenue,
        growth,
        products_count,
        rating,
        verified,
      } = req.body;

      const updateData: Record<string, any> = {};

      if (name !== undefined) updateData.name = name;
      if (url !== undefined) updateData.url = url;
      if (logo !== undefined) updateData.logo = logo || null;
      if (category_id !== undefined) updateData.category_id = category_id || null;
      if (country !== undefined) updateData.country = country || null;
      if (monthly_traffic !== undefined) updateData.monthly_traffic = monthly_traffic;
      if (monthly_revenue !== undefined) updateData.monthly_revenue = monthly_revenue || null;
      if (growth !== undefined) updateData.growth = growth;
      if (products_count !== undefined) updateData.products_count = products_count || null;
      if (rating !== undefined) updateData.rating = rating || null;
      if (verified !== undefined) updateData.verified = verified;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updateData.updated_at = new Date().toISOString();

      const { data: updated, error: updateError } = await supabaseAdmin
        .from('competitor_stores')
        .update(updateData)
        .eq('id', id)
        .select('*, categories(id, name, slug)')
        .single();

      if (updateError || !updated) {
        return res.status(404).json({ error: 'Competitor store not found' });
      }

      const store = mapCompetitorStore(updated);

      return res.json({ store });
    } catch (error: any) {
      console.error('Unexpected error in PATCH competitor store:', error);
      return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
  });

  router.delete('/competitor-stores/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await supabaseRemote.from('competitor_stores').delete().eq('id', id);

      return res.json({ success: true });
    } catch (error: any) {
      console.error('Unexpected error in DELETE competitor store:', error);
      return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
  });

  // Competitor store products
  function mapCompetitorStoreProduct(item: any) {
    const prod = item.products;
    return {
      id: item.id,
      competitor_store_id: item.competitor_store_id,
      product_id: item.product_id,
      discovered_at: item.discovered_at,
      last_seen_at: item.last_seen_at,
      product: prod ? { id: prod.id, title: prod.title, image: prod.image } : null,
    };
  }

  router.get('/competitor-stores/:id/products', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('competitor_store_products')
        .select('*, products(id, title, image)')
        .eq('competitor_store_id', id);

      if (error) {
        console.error('Error fetching competitor store products:', error);
        return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
      }

      const products = (data || []).map(mapCompetitorStoreProduct);

      return res.json({ products });
    } catch (error: any) {
      console.error('Unexpected error in GET competitor store products:', error);
      return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
  });

  router.post('/competitor-stores/:id/products', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { product_id } = req.body;

      if (!product_id) {
        return res.status(400).json({ error: 'product_id is required' });
      }

      const { data: inserted, error: insertError } = await supabaseAdmin
        .from('competitor_store_products')
        .insert({ competitor_store_id: id, product_id })
        .select('*, products(id, title, image)')
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          return res.status(409).json({ error: 'Product is already linked to this store' });
        }
        console.error('Error linking product:', insertError);
        return res.status(500).json({ error: 'An unexpected error occurred', details: insertError.message });
      }

      const product = mapCompetitorStoreProduct(inserted);

      return res.status(201).json({ product });
    } catch (error: any) {
      console.error('Unexpected error in POST competitor store product:', error);
      return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
  });

  router.delete('/competitor-stores/:id/products', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const productId = req.query.product_id as string | undefined;

      if (!productId) {
        return res.status(400).json({ error: 'product_id query parameter is required' });
      }

      await supabaseAdmin
        .from('competitor_store_products')
        .delete()
        .eq('competitor_store_id', id)
        .eq('product_id', productId);

      return res.json({ success: true });
    } catch (error: any) {
      console.error('Unexpected error in DELETE competitor store product:', error);
      return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
  });

  // Competitor store verify
  router.patch('/competitor-stores/:id/verify', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { verified } = req.body;

      if (typeof verified !== 'boolean') {
        return res.status(400).json({ error: 'verified must be a boolean' });
      }

      const { data: updated, error: updateError } = await supabaseAdmin
        .from('competitor_stores')
        .update({ verified, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*, categories(id, name, slug)')
        .single();

      if (updateError || !updated) {
        return res.status(404).json({ error: 'Competitor store not found' });
      }

      const store = mapCompetitorStore(updated);

      return res.json({ store });
    } catch (error: any) {
      console.error('Unexpected error in PATCH competitor store verification:', error);
      return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
  });

  // =============================================
  // COURSES
  // =============================================
  router.get('/courses', async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const level = req.query.level as string | undefined;
      const search = req.query.search as string | undefined;
      const featured = req.query.featured as string | undefined;
      const published = req.query.published as string | undefined;
      const sortBy = (req.query.sortBy as string) || 'created_at';
      const sortOrder = (req.query.sortOrder as string) || 'desc';
      const page = parseInt((req.query.page as string) || '1');
      const pageSize = parseInt((req.query.pageSize as string) || '20');

      let countQuery = supabaseAdmin.from('courses').select('*', { count: 'exact', head: true });
      let dataQuery = supabaseAdmin.from('courses').select('*');

      if (category) {
        countQuery = countQuery.eq('category', category);
        dataQuery = dataQuery.eq('category', category);
      }
      if (level) {
        countQuery = countQuery.eq('level', level);
        dataQuery = dataQuery.eq('level', level);
      }
      if (featured === 'true') {
        countQuery = countQuery.eq('featured', true);
        dataQuery = dataQuery.eq('featured', true);
      }
      if (published === 'true') {
        countQuery = countQuery.eq('published', true);
        dataQuery = dataQuery.eq('published', true);
      } else if (published === 'false') {
        countQuery = countQuery.eq('published', false);
        dataQuery = dataQuery.eq('published', false);
      }
      if (search) {
        countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`);
        dataQuery = dataQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`);
      }

      const allowedSortColumns = ['created_at', 'updated_at', 'title', 'price', 'students_count', 'rating', 'published_at'];
      const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';

      dataQuery = dataQuery.order(safeSortBy, { ascending: sortOrder === 'asc', nullsFirst: false });

      const offset = (page - 1) * pageSize;
      dataQuery = dataQuery.range(offset, offset + pageSize - 1);

      const [{ count: total }, { data, error }] = await Promise.all([countQuery, dataQuery]);

      if (error) {
        console.error('Error fetching courses:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const instructorIds = (data || [])
        .map((c: any) => c.instructor_id)
        .filter((id: any) => id !== null);

      let instructorMap: Record<string, { full_name: string | null; avatar_url: string | null }> = {};

      if (instructorIds.length > 0) {
        const { data: profiles } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', instructorIds);

        if (profiles) {
          profiles.forEach((profile: any) => {
            instructorMap[profile.id] = {
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
            };
          });
        }
      }

      const courses = (data || []).map((course: any) => {
        const instructor = course.instructor_id ? instructorMap[course.instructor_id] : null;

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          instructor_id: course.instructor_id,
          thumbnail: course.thumbnail,
          duration_minutes: course.duration_minutes,
          lessons_count: course.lessons_count || 0,
          students_count: course.students_count || 0,
          rating: course.rating ? parseFloat(course.rating) : null,
          price: parseFloat(course.price || '0'),
          category: course.category,
          level: course.level,
          featured: course.featured || false,
          published: course.published || false,
          published_at: course.published_at,
          tags: course.tags || [],
          learning_objectives: course.learning_objectives || [],
          prerequisites: course.prerequisites || [],
          created_at: course.created_at,
          updated_at: course.updated_at,
          instructor_name: instructor?.full_name || undefined,
          instructor_avatar: instructor?.avatar_url || undefined,
        };
      });

      const totalCount = total || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      return res.json({
        courses,
        total: totalCount,
        page,
        pageSize,
        totalPages,
      });
    } catch (error) {
      console.error('Unexpected error fetching courses:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/courses', async (req: Request, res: Response) => {
    try {
      const {
        title,
        slug,
        description,
        instructor_id,
        thumbnail,
        category,
        level,
        price = 0,
        tags = [],
        learning_objectives = [],
        prerequisites = [],
        featured = false,
        published = false,
      } = req.body;

      if (!title || !slug) {
        return res.status(400).json({ error: 'Missing required fields: title, slug' });
      }

      const { data: existing } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq('slug', slug)
        .limit(1);

      if (existing && existing.length > 0) {
        return res.status(400).json({ error: 'Course with this slug already exists' });
      }

      const { data: result, error } = await supabaseAdmin
        .from('courses')
        .insert({
          title,
          slug,
          description: description || null,
          instructor_id: instructor_id || null,
          thumbnail: thumbnail || null,
          category: category || null,
          level: level || null,
          price: price || 0,
          tags: tags || [],
          learning_objectives: learning_objectives || [],
          prerequisites: prerequisites || [],
          featured: featured || false,
          published: published || false,
          published_at: published ? new Date().toISOString() : null,
          duration_minutes: 0,
          lessons_count: 0,
          students_count: 0,
        })
        .select()
        .single();

      if (error || !result) {
        console.error('Error creating course:', error);
        return res.status(500).json({ error: 'Failed to create course' });
      }

      return res.status(201).json({ course: result });
    } catch (error) {
      console.error('Unexpected error creating course:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/courses/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data: courseData, error: courseError } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError || !courseData) {
        return res.status(404).json({ error: 'Course not found', courseId: id });
      }

      let instructorProfile: { full_name: string | null; avatar_url: string | null } | null = null;
      if (courseData.instructor_id) {
        const { data: profileResult } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', courseData.instructor_id)
          .single();

        if (profileResult) {
          instructorProfile = {
            full_name: profileResult.full_name,
            avatar_url: profileResult.avatar_url,
          };
        }
      }

      const { data: modulesData } = await supabaseAdmin
        .from('course_modules')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });

      const modules = (modulesData || []).map((module: any) => ({
        ...module,
        chapters: [],
      }));

      const course = {
        id: courseData.id,
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        instructor_id: courseData.instructor_id,
        thumbnail: courseData.thumbnail,
        duration_minutes: courseData.duration_minutes,
        lessons_count: courseData.lessons_count || 0,
        students_count: courseData.students_count || 0,
        rating: courseData.rating ? parseFloat(courseData.rating) : null,
        price: parseFloat(courseData.price || '0'),
        category: courseData.category,
        level: courseData.level,
        featured: courseData.featured || false,
        published: courseData.published || false,
        published_at: courseData.published_at,
        tags: courseData.tags || [],
        learning_objectives: courseData.learning_objectives || [],
        prerequisites: courseData.prerequisites || [],
        created_at: courseData.created_at,
        updated_at: courseData.updated_at,
        instructor_name: instructorProfile?.full_name || undefined,
        instructor_avatar: instructorProfile?.avatar_url || undefined,
        modules,
      };

      return res.json({ course });
    } catch (error) {
      console.error('Unexpected error fetching course:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/courses/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const body = req.body;

      const {
        title,
        slug,
        description,
        instructor_id,
        thumbnail,
        category,
        level,
        price,
        tags,
        learning_objectives,
        prerequisites,
        featured,
        published,
      } = body;

      const updateData: Record<string, any> = {};

      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug;
      if (description !== undefined) updateData.description = description;
      if (instructor_id !== undefined) updateData.instructor_id = instructor_id;
      if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
      if (category !== undefined) updateData.category = category;
      if (level !== undefined) updateData.level = level;
      if (price !== undefined) updateData.price = price;
      if (tags !== undefined) updateData.tags = tags;
      if (learning_objectives !== undefined) updateData.learning_objectives = learning_objectives;
      if (prerequisites !== undefined) updateData.prerequisites = prerequisites;
      if (featured !== undefined) updateData.featured = featured;
      if (published !== undefined) {
        updateData.published = published;
        if (published && !body.published_at) {
          const { data: existing } = await supabaseAdmin
            .from('courses')
            .select('published_at')
            .eq('id', id)
            .single();

          if (existing && !existing.published_at) {
            updateData.published_at = new Date().toISOString();
          }
        }
      }

      if (slug) {
        const { data: existing } = await supabaseAdmin
          .from('courses')
          .select('id')
          .eq('slug', slug)
          .neq('id', id)
          .limit(1);

        if (existing && existing.length > 0) {
          return res.status(400).json({ error: 'Course with this slug already exists' });
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updateData.updated_at = new Date().toISOString();

      const { data: result, error } = await supabaseAdmin
        .from('courses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !result) {
        return res.status(500).json({ error: 'Failed to update course' });
      }

      return res.json({ course: result });
    } catch (error) {
      console.error('Unexpected error updating course:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/courses/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await supabaseAdmin.from('courses').delete().eq('id', id);

      return res.json({ success: true });
    } catch (error) {
      console.error('Unexpected error deleting course:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Course publish
  router.patch('/courses/:id/publish', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { published } = req.body;

      if (typeof published !== 'boolean') {
        return res.status(400).json({ error: 'published field is required and must be a boolean' });
      }

      const updateData: Record<string, any> = {
        published,
        updated_at: new Date().toISOString(),
      };

      if (published) {
        const { data: existing } = await supabaseAdmin
          .from('courses')
          .select('published_at')
          .eq('id', id)
          .single();

        if (existing && !existing.published_at) {
          updateData.published_at = new Date().toISOString();
        }
      }

      const { data: result, error } = await supabaseAdmin
        .from('courses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !result) {
        return res.status(500).json({ error: 'Failed to update course publish status' });
      }

      return res.json({ course: result });
    } catch (error) {
      console.error('Unexpected error updating course publish status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Course modules
  router.post('/courses/:id/modules', async (req: Request, res: Response) => {
    try {
      const courseId = req.params.id;
      const {
        title,
        description,
        thumbnail,
        order_index,
        duration_minutes,
        is_preview = false,
      } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'title is required' });
      }

      let finalOrderIndex = order_index;
      if (finalOrderIndex === undefined) {
        const { data: maxResult } = await supabaseAdmin
          .from('course_modules')
          .select('order_index')
          .eq('course_id', courseId)
          .order('order_index', { ascending: false })
          .limit(1);

        finalOrderIndex = (maxResult && maxResult.length > 0 ? maxResult[0].order_index : -1) + 1;
      }

      const { data: result, error } = await supabaseAdmin
        .from('course_modules')
        .insert({
          course_id: courseId,
          title,
          description: description || null,
          thumbnail: thumbnail || null,
          order_index: finalOrderIndex,
          duration_minutes: duration_minutes || null,
          is_preview: is_preview || false,
        })
        .select()
        .single();

      if (error || !result) {
        console.error('Error creating module:', error);
        return res.status(500).json({ error: 'Failed to create module' });
      }

      return res.status(201).json({ module: result });
    } catch (error) {
      console.error('Unexpected error creating module:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/courses/:id/modules/:moduleId', async (req: Request, res: Response) => {
    try {
      const { moduleId } = req.params;
      const {
        title,
        description,
        thumbnail,
        order_index,
        duration_minutes,
        is_preview,
      } = req.body;

      const updateData: Record<string, any> = {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
      if (order_index !== undefined) updateData.order_index = order_index;
      if (duration_minutes !== undefined) updateData.duration_minutes = duration_minutes;
      if (is_preview !== undefined) updateData.is_preview = is_preview;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updateData.updated_at = new Date().toISOString();

      const { data: result, error } = await supabaseAdmin
        .from('course_modules')
        .update(updateData)
        .eq('id', moduleId)
        .select()
        .single();

      if (error || !result) {
        return res.status(500).json({ error: 'Failed to update module' });
      }

      return res.json({ module: result });
    } catch (error) {
      console.error('Unexpected error updating module:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/courses/:id/modules/:moduleId', async (req: Request, res: Response) => {
    try {
      const { moduleId } = req.params;

      await supabaseAdmin.from('course_modules').delete().eq('id', moduleId);

      return res.json({ success: true });
    } catch (error) {
      console.error('Unexpected error deleting module:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Course chapters
  router.post('/courses/:id/modules/:moduleId/chapters', async (req: Request, res: Response) => {
    try {
      const courseId = req.params.id;
      const { moduleId } = req.params;
      const {
        title,
        description,
        content_type,
        content,
        order_index,
        duration_minutes,
        is_preview = false,
      } = req.body;

      if (!title || !content_type || !content) {
        return res.status(400).json({ error: 'title, content_type, and content are required' });
      }

      const validContentTypes = ['video', 'text', 'quiz', 'assignment', 'resource'];
      if (!validContentTypes.includes(content_type)) {
        return res.status(400).json({ error: `content_type must be one of: ${validContentTypes.join(', ')}` });
      }

      let finalOrderIndex = order_index;
      if (finalOrderIndex === undefined) {
        const { data: maxResult } = await supabaseAdmin
          .from('course_chapters')
          .select('order_index')
          .eq('module_id', moduleId)
          .order('order_index', { ascending: false })
          .limit(1);

        finalOrderIndex = (maxResult && maxResult.length > 0 ? maxResult[0].order_index : -1) + 1;
      }

      let finalContent = content;
      if (content_type === 'video' && content?.video_storage_path) {
        const tempPath = content.video_storage_path;
        if (tempPath.includes('/temp/')) {
          try {
            const { moveVideoFromTemp } = await import('../../src/lib/storage/course-storage');

            const { data: tempChapter, error: tempError } = await supabaseAdmin
              .from('course_chapters')
              .insert({
                module_id: moduleId,
                title,
                description: description || null,
                content_type,
                content: { ...content, video_storage_path: tempPath },
                order_index: finalOrderIndex,
                duration_minutes: duration_minutes || null,
                is_preview: is_preview || false,
              })
              .select()
              .single();

            if (tempError || !tempChapter) {
              throw new Error('Failed to create chapter for video move');
            }

            const movedVideo = await moveVideoFromTemp(
              tempPath,
              courseId,
              moduleId,
              tempChapter.id
            );

            finalContent = {
              ...content,
              video_url: movedVideo.url,
              video_storage_path: movedVideo.path,
            };

            const { data: updateResult, error: updateError } = await supabaseAdmin
              .from('course_chapters')
              .update({ content: finalContent })
              .eq('id', tempChapter.id)
              .select()
              .single();

            if (updateError || !updateResult) {
              await supabaseAdmin.from('course_chapters').delete().eq('id', tempChapter.id);
              throw new Error('Failed to update chapter with final video path');
            }

            return res.status(201).json({ chapter: updateResult });
          } catch (moveError) {
            console.error('Error moving temp video:', moveError);
            return res.status(500).json({
              error: 'Failed to move video from temp storage',
              details: moveError instanceof Error ? moveError.message : 'Unknown error',
            });
          }
        }
      }

      const { data: result, error } = await supabaseAdmin
        .from('course_chapters')
        .insert({
          module_id: moduleId,
          title,
          description: description || null,
          content_type,
          content: finalContent,
          order_index: finalOrderIndex,
          duration_minutes: duration_minutes || null,
          is_preview: is_preview || false,
        })
        .select()
        .single();

      if (error || !result) {
        console.error('Error creating chapter:', error);
        return res.status(500).json({ error: 'Failed to create chapter' });
      }

      return res.status(201).json({ chapter: result });
    } catch (error) {
      console.error('Unexpected error creating chapter:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/courses/:id/modules/:moduleId/chapters/:chapterId', async (req: Request, res: Response) => {
    try {
      const { chapterId } = req.params;
      const {
        title,
        description,
        content_type,
        content,
        order_index,
        duration_minutes,
        is_preview,
      } = req.body;

      const updateData: Record<string, any> = {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (content_type !== undefined) {
        const validContentTypes = ['video', 'text', 'quiz', 'assignment', 'resource'];
        if (!validContentTypes.includes(content_type)) {
          return res.status(400).json({ error: `content_type must be one of: ${validContentTypes.join(', ')}` });
        }
        updateData.content_type = content_type;
      }
      if (content !== undefined) updateData.content = content;
      if (order_index !== undefined) updateData.order_index = order_index;
      if (duration_minutes !== undefined) updateData.duration_minutes = duration_minutes;
      if (is_preview !== undefined) updateData.is_preview = is_preview;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updateData.updated_at = new Date().toISOString();

      const { data: result, error } = await supabaseAdmin
        .from('course_chapters')
        .update(updateData)
        .eq('id', chapterId)
        .select()
        .single();

      if (error || !result) {
        return res.status(500).json({ error: 'Failed to update chapter' });
      }

      return res.json({ chapter: result });
    } catch (error) {
      console.error('Unexpected error updating chapter:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/courses/:id/modules/:moduleId/chapters/:chapterId', async (req: Request, res: Response) => {
    try {
      const { chapterId } = req.params;

      await supabaseAdmin.from('course_chapters').delete().eq('id', chapterId);

      return res.json({ success: true });
    } catch (error) {
      console.error('Unexpected error deleting chapter:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Upload video for chapter
  router.post('/courses/:id/modules/:moduleId/chapters/:chapterId/upload-video', upload.single('file'), async (req: Request, res: Response) => {
    try {
      const courseId = req.params.id;
      const { moduleId, chapterId } = req.params;

      const { data: courseResult, error: courseError } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq('id', courseId)
        .single();

      if (courseError || !courseResult) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const { data: moduleResult, error: moduleError } = await supabaseAdmin
        .from('course_modules')
        .select('id, course_id')
        .eq('id', moduleId)
        .eq('course_id', courseId)
        .single();

      if (moduleError || !moduleResult) {
        return res.status(404).json({ error: 'Module not found' });
      }

      const isTempUpload = chapterId === 'new' || chapterId.startsWith('temp-');
      let chapterExists = false;

      if (!isTempUpload) {
        const { data: chapterResult, error: chapterError } = await supabaseAdmin
          .from('course_chapters')
          .select('id, module_id')
          .eq('id', chapterId)
          .eq('module_id', moduleId)
          .single();

        if (chapterError || !chapterResult) {
          return res.status(404).json({ error: 'Chapter not found' });
        }
        chapterExists = true;
      }

      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type. Only MP4, WebM, OGG, and QuickTime videos are allowed.' });
      }

      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        return res.status(400).json({ error: 'File size exceeds maximum allowed size of 500MB' });
      }

      const { uploadCourseVideo, getVideoSignedUrl } = await import('../../src/lib/storage/course-storage');

      const blob = new Blob([file.buffer], { type: file.mimetype });
      const fileObj = new File([blob], file.originalname, { type: file.mimetype });

      const uploadResult = await uploadCourseVideo({
        file: fileObj,
        courseId,
        moduleId,
        chapterId,
        filename: file.originalname,
      });

      const signedUrl = await getVideoSignedUrl(uploadResult.path, 3600);

      if (chapterExists) {
        const { data: currentChapter } = await supabaseAdmin
          .from('course_chapters')
          .select('content')
          .eq('id', chapterId)
          .single();

        const chapterContent = currentChapter?.content || {};
        const updatedContent = {
          ...chapterContent,
          video_url: uploadResult.url,
          video_storage_path: uploadResult.path,
          video_duration: null,
        };

        const { error: updateError } = await supabaseAdmin
          .from('course_chapters')
          .update({ content: updatedContent, updated_at: new Date().toISOString() })
          .eq('id', chapterId);

        if (updateError) {
          await supabaseAdmin.storage
            .from('course-videos')
            .remove([uploadResult.path])
            .catch(() => {});

          return res.status(500).json({ error: 'Failed to update chapter content' });
        }
      }

      return res.json({
        success: true,
        video: {
          url: uploadResult.url,
          signedUrl,
          path: uploadResult.path,
          size: uploadResult.size,
        },
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to upload video' });
    }
  });

  // =============================================
  // EXTERNAL USERS
  // =============================================
  function mapExternalUserFromDB(data: any) {
    return {
      id: data.id,
      name: data.full_name || "",
      email: data.email,
      plan: data.subscription_plans?.slug || "free",
      status: data.status || "active",
      subscriptionDate: data.subscription_started_at
        ? new Date(data.subscription_started_at)
        : new Date(data.created_at),
      expiryDate: data.subscription_ends_at
        ? new Date(data.subscription_ends_at)
        : new Date(data.created_at),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      isTrial: data.is_trial || false,
      trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : null,
      subscriptionStatus: data.subscription_status || "active",
      credits: data.credits || 0,
      phoneNumber: data.phone_number || undefined,
      username: data.username || undefined,
      avatarUrl: data.avatar_url || undefined,
    };
  }

  router.get('/external-users', async (req: Request, res: Response) => {
    try {
      const { data: rows, error } = await supabaseAdmin
        .from('profiles')
        .select('*, subscription_plans(id, name, slug, price_monthly, features, trial_days)')
        .is('internal_role', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching external users:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!rows || rows.length === 0) {
        return res.json([]);
      }

      const users = rows.map((row: any) => mapExternalUserFromDB(row));

      return res.json(users);
    } catch (error) {
      console.error('Error in GET /api/admin/external-users:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/external-users', async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        password,
        plan = 'free',
        status = 'active',
        credits = 0,
        phoneNumber,
        username,
        avatarUrl,
        isTrial = false,
        trialEndsAt,
        subscriptionStartDate,
        subscriptionEndDate,
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      const { data: existing } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .limit(1);

      if (existing && existing.length > 0) {
        return res.status(409).json({ error: 'A user with this email already exists' });
      }

      const { data: planResult } = await supabaseAdmin
        .from('subscription_plans')
        .select('id, trial_days')
        .eq('slug', plan)
        .limit(1);

      if (!planResult || planResult.length === 0) {
        return res.status(400).json({ error: `Plan "${plan}" not found` });
      }

      const planData = planResult[0];

      const startDate = subscriptionStartDate ? new Date(subscriptionStartDate) : new Date();
      let endDate = subscriptionEndDate ? new Date(subscriptionEndDate) : null;
      let calculatedTrialEndsAt = trialEndsAt ? new Date(trialEndsAt) : null;

      if (isTrial && !calculatedTrialEndsAt && planData.trial_days > 0) {
        calculatedTrialEndsAt = new Date(startDate);
        calculatedTrialEndsAt.setDate(calculatedTrialEndsAt.getDate() + planData.trial_days);
      }

      if (!endDate) {
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
      }

      if (endDate < startDate) {
        return res.status(400).json({ error: 'Subscription end date must be after start date' });
      }

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name },
      });

      if (authError || !authData.user) {
        console.error('Error creating auth user:', authError);
        return res.status(500).json({ error: authError?.message || 'Failed to create user' });
      }

      const now = new Date().toISOString();

      await supabaseAdmin
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email,
          full_name: name,
          internal_role: null,
          subscription_plan_id: planData.id,
          subscription_status: isTrial ? 'trial' : 'active',
          subscription_started_at: startDate.toISOString(),
          subscription_ends_at: endDate.toISOString(),
          status,
          credits,
          phone_number: phoneNumber || null,
          username: username || null,
          avatar_url: avatarUrl || null,
          is_trial: isTrial,
          trial_ends_at: calculatedTrialEndsAt ? calculatedTrialEndsAt.toISOString() : null,
          created_at: now,
          updated_at: now,
        }, { onConflict: 'id' });

      const { data: rows } = await supabaseAdmin
        .from('profiles')
        .select('*, subscription_plans(id, name, slug, price_monthly, features, trial_days)')
        .eq('id', authData.user.id);

      if (!rows || rows.length === 0) {
        return res.status(500).json({ error: 'Failed to fetch created user' });
      }

      const user = mapExternalUserFromDB(rows[0]);

      return res.status(201).json(user);
    } catch (error) {
      console.error('Error in POST /api/admin/external-users:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  async function fetchUserWithPlan(id: string) {
    const { data } = await supabaseAdmin
      .from('profiles')
      .select('*, subscription_plans(id, name, slug, price_monthly, features, trial_days)')
      .eq('id', id)
      .is('internal_role', null)
      .single();

    return data;
  }

  router.get('/external-users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const row = await fetchUserWithPlan(id);

      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = mapExternalUserFromDB(row);

      return res.json(user);
    } catch (error) {
      console.error('Error in GET /api/admin/external-users/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/external-users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        plan,
        status,
        credits,
        phoneNumber,
        username,
        avatarUrl,
        isTrial,
        trialEndsAt,
        subscriptionStartDate,
        subscriptionEndsAt,
        password,
      } = req.body;

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (name !== undefined) updateData.full_name = name;
      if (email !== undefined) updateData.email = email;
      if (status !== undefined) {
        const validStatuses = ['active', 'inactive', 'suspended'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ error: 'Invalid status. Must be one of: active, inactive, suspended' });
        }
        updateData.status = status;
      }
      if (credits !== undefined) updateData.credits = credits;
      if (phoneNumber !== undefined) updateData.phone_number = phoneNumber || null;
      if (username !== undefined) updateData.username = username || null;
      if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl || null;
      if (subscriptionStartDate !== undefined) {
        updateData.subscription_started_at = subscriptionStartDate ? new Date(subscriptionStartDate).toISOString() : null;
      }
      if (subscriptionEndsAt !== undefined) {
        updateData.subscription_ends_at = subscriptionEndsAt ? new Date(subscriptionEndsAt).toISOString() : null;
      }
      if (isTrial !== undefined) {
        updateData.is_trial = isTrial;
        updateData.subscription_status = isTrial ? 'trial' : 'active';
      }
      if (trialEndsAt !== undefined) {
        updateData.trial_ends_at = trialEndsAt ? new Date(trialEndsAt).toISOString() : null;
      }

      if (password !== undefined && password.trim() !== '') {
        const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(id, {
          password,
        });
        if (pwError) {
          console.error('Error updating password:', pwError);
          return res.status(500).json({ error: 'Failed to update password' });
        }
      }

      if (email !== undefined) {
        const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(id, {
          email,
        });
        if (emailError) {
          console.error('Error updating email in auth:', emailError);
        }
      }

      if (updateData.subscription_started_at && updateData.subscription_ends_at) {
        const startDate = new Date(updateData.subscription_started_at as string);
        const endDate = new Date(updateData.subscription_ends_at as string);
        if (endDate < startDate) {
          return res.status(400).json({ error: 'Subscription end date must be after start date' });
        }
      }

      if (plan !== undefined) {
        const { data: planResult } = await supabaseAdmin
          .from('subscription_plans')
          .select('id, trial_days')
          .eq('slug', plan)
          .limit(1);

        if (!planResult || planResult.length === 0) {
          return res.status(400).json({ error: `Plan "${plan}" not found` });
        }

        const planData = planResult[0];
        updateData.subscription_plan_id = planData.id;

        if (isTrial !== undefined && isTrial && planData.trial_days > 0) {
          const startDate = updateData.subscription_started_at
            ? new Date(updateData.subscription_started_at as string)
            : new Date();
          const calculatedTrialEndsAt = new Date(startDate);
          calculatedTrialEndsAt.setDate(calculatedTrialEndsAt.getDate() + planData.trial_days);
          updateData.trial_ends_at = calculatedTrialEndsAt.toISOString();
        }
      }

      const { data: updateResult, error: updateError } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', id)
        .is('internal_role', null)
        .select('id');

      if (updateError) {
        if (updateError.code === '23505') {
          return res.status(409).json({ error: 'A user with this email already exists' });
        }
        throw updateError;
      }

      if (!updateResult || updateResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const row = await fetchUserWithPlan(id);

      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = mapExternalUserFromDB(row);

      return res.json(user);
    } catch (error: any) {
      if (error?.code === '23505') {
        return res.status(409).json({ error: 'A user with this email already exists' });
      }
      console.error('Error in PATCH /api/admin/external-users/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/external-users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (authError) {
        console.error('Error deleting auth user:', authError);
      }

      await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', id)
        .is('internal_role', null);

      return res.json({ success: true });
    } catch (error) {
      console.error('Error in DELETE /api/admin/external-users/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================
  // INTERNAL USERS
  // =============================================
  router.get('/internal-users', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .not('internal_role', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching internal users:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!data || data.length === 0) {
        return res.json([]);
      }

      const users = data.map((user: any) => ({
        id: user.id,
        name: user.full_name || '',
        email: user.email,
        role: user.internal_role,
        status: user.status || 'active',
        phoneNumber: user.phone_number || null,
        username: user.username || null,
        avatarUrl: user.avatar_url || null,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }));

      return res.json(users);
    } catch (error) {
      console.error('Error in GET /api/admin/internal-users:', error);
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      return res.status(500).json({
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error)
      });
    }
  });

  router.post('/internal-users', async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, status = 'active', phoneNumber, username, avatarUrl } = req.body;

      if (!name || !email || !role || !password) {
        return res.status(400).json({ error: 'Name, email, password, and role are required' });
      }

      const validRoles = ['superadmin', 'admin', 'manager', 'executive'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be one of: superadmin, admin, manager, executive' });
      }

      const { data: existing } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .limit(1);

      if (existing && existing.length > 0) {
        return res.status(409).json({ error: 'A user with this email already exists' });
      }

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name },
      });

      if (authError || !authData.user) {
        console.error('Error creating auth user:', authError);
        return res.status(500).json({ error: authError?.message || 'Failed to create user' });
      }

      const now = new Date().toISOString();

      const { data: result, error } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email,
          full_name: name,
          internal_role: role,
          status,
          phone_number: phoneNumber || null,
          username: username || null,
          avatar_url: avatarUrl || null,
          created_at: now,
          updated_at: now,
        }, { onConflict: 'id' })
        .select()
        .single();

      if (error || !result) {
        console.error('Error creating internal user profile:', error);
        return res.status(500).json({ error: 'Failed to create user profile' });
      }

      const user = {
        id: result.id,
        name: result.full_name || '',
        email: result.email,
        role: result.internal_role,
        status: result.status || 'active',
        phoneNumber: result.phone_number || null,
        username: result.username || null,
        avatarUrl: result.avatar_url || null,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      };

      return res.status(201).json(user);
    } catch (error) {
      console.error('Error in POST /api/admin/internal-users:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/internal-users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data || data.internal_role === null) {
        return res.status(404).json({ error: 'User not found or not an internal user' });
      }

      const user = {
        id: data.id,
        name: data.full_name || '',
        email: data.email,
        role: data.internal_role,
        status: data.status || 'active',
        phoneNumber: data.phone_number || null,
        username: data.username || null,
        avatarUrl: data.avatar_url || null,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return res.json(user);
    } catch (error) {
      console.error('Error in GET /api/admin/internal-users/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/internal-users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, email, role, status, phoneNumber, username, avatarUrl, password } = req.body;

      const { data: existing, error: existingError } = await supabaseAdmin
        .from('profiles')
        .select('internal_role')
        .eq('id', id)
        .single();

      if (existingError || !existing || existing.internal_role === null) {
        return res.status(404).json({ error: 'User not found or not an internal user' });
      }

      if (password !== undefined && password.trim() !== '') {
        const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(id, {
          password,
        });
        if (pwError) {
          console.error('Error updating password:', pwError);
          return res.status(500).json({ error: 'Failed to update password' });
        }
      }

      if (email !== undefined) {
        const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(id, {
          email,
        });
        if (emailError) {
          console.error('Error updating email in auth:', emailError);
        }
      }

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (name !== undefined) updateData.full_name = name;
      if (email !== undefined) updateData.email = email;
      if (role !== undefined) {
        const validRoles = ['superadmin', 'admin', 'manager', 'executive'];
        if (!validRoles.includes(role)) {
          return res.status(400).json({ error: 'Invalid role. Must be one of: superadmin, admin, manager, executive' });
        }
        updateData.internal_role = role;
      }
      if (status !== undefined) {
        const validStatuses = ['active', 'inactive', 'suspended'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ error: 'Invalid status. Must be one of: active, inactive, suspended' });
        }
        updateData.status = status;
      }
      if (phoneNumber !== undefined) updateData.phone_number = phoneNumber || null;
      if (username !== undefined) updateData.username = username || null;
      if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl || null;

      const { data: result, error: updateError } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        if (updateError.code === '23505') {
          return res.status(409).json({ error: 'A user with this email already exists' });
        }
        return res.status(404).json({ error: 'User not found' });
      }

      if (!result) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = {
        id: result.id,
        name: result.full_name || '',
        email: result.email,
        role: result.internal_role,
        status: result.status || 'active',
        phoneNumber: result.phone_number || null,
        username: result.username || null,
        avatarUrl: result.avatar_url || null,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      };

      return res.json(user);
    } catch (error) {
      console.error('Error in PATCH /api/admin/internal-users/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/internal-users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data: existing } = await supabaseAdmin
        .from('profiles')
        .select('internal_role')
        .eq('id', id)
        .single();

      if (!existing || existing.internal_role === null) {
        return res.status(404).json({ error: 'User not found or not an internal user' });
      }

      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (authError) {
        console.error('Error deleting auth user:', authError);
      }

      await supabaseAdmin.from('profiles').delete().eq('id', id);

      return res.json({ success: true });
    } catch (error) {
      console.error('Error in DELETE /api/admin/internal-users/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================
  // LEADS
  // =============================================
  router.get('/leads', async (req: Request, res: Response) => {
    try {
      const stage = req.query.stage as string | undefined;
      const search = req.query.search as string | undefined;
      const priority = req.query.priority as string | undefined;

      const { data: profiles, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('id, email, full_name, avatar_url, account_type, subscription_status, onboarding_completed, onboarding_progress, created_at, updated_at, subscription_plan_id, subscription_plans(name, slug)')
        .is('internal_role', null)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return res.status(500).json({ error: 'Failed to fetch profiles' });
      }

      const { data: leadsData, error: leadsError } = await supabaseAdmin
        .from('leads')
        .select('*');

      if (leadsError) {
        console.error('Error fetching leads:', leadsError);
        return res.status(500).json({ error: 'Failed to fetch leads' });
      }

      const leadsMap = new Map((leadsData || []).map((l: any) => [l.user_id, l]));

      const [picklistResult, shopifyResult, roadmapResult] = await Promise.all([
        supabaseAdmin.from('user_picklist').select('user_id'),
        supabaseAdmin.from('shopify_stores').select('user_id'),
        supabaseAdmin.from('roadmap_progress').select('user_id, status'),
      ]);

      const picklistByUser = new Map<string, number>();
      (picklistResult.data || []).forEach((p: any) => {
        picklistByUser.set(p.user_id, (picklistByUser.get(p.user_id) || 0) + 1);
      });

      const shopifyUsers = new Set((shopifyResult.data || []).map((s: any) => s.user_id));

      const roadmapByUser = new Map<string, { total: number; completed: number }>();
      (roadmapResult.data || []).forEach((r: any) => {
        const curr = roadmapByUser.get(r.user_id) || { total: 0, completed: 0 };
        curr.total++;
        if (r.status === 'completed') curr.completed++;
        roadmapByUser.set(r.user_id, curr);
      });

      let leads = (profiles || []).map((p: any) => {
        const leadRecord = leadsMap.get(p.id);
        const planObj = p.subscription_plans;
        const planSlug = planObj?.slug || 'free';

        let derivedStage = 'new_lead';
        if (p.account_type === 'pro' || planSlug === 'pro') {
          derivedStage = 'converted';
        } else if (p.onboarding_completed || (p.onboarding_progress && p.onboarding_progress > 50)) {
          derivedStage = 'engaged';
        }

        const finalStage = leadRecord?.stage || derivedStage;

        const savedProducts = picklistByUser.get(p.id) || 0;
        const hasShopify = shopifyUsers.has(p.id);
        const roadmap = roadmapByUser.get(p.id);

        let engagementScore = 0;
        if (p.onboarding_completed) engagementScore += 30;
        if (savedProducts > 0) engagementScore += 20;
        if (hasShopify) engagementScore += 25;
        if (roadmap && roadmap.completed > 0) engagementScore += 15;
        if (p.onboarding_progress > 0) engagementScore += 10;
        engagementScore = Math.min(engagementScore, 100);

        return {
          id: leadRecord?.id || p.id,
          user_id: p.id,
          email: p.email,
          full_name: p.full_name,
          avatar_url: p.avatar_url,
          plan: planSlug,
          plan_name: planObj?.name || 'Free',
          account_type: p.account_type || 'free',
          stage: finalStage,
          source: leadRecord?.source || 'organic',
          priority: leadRecord?.priority || 'medium',
          assigned_to: leadRecord?.assigned_to || null,
          notes: leadRecord?.notes || null,
          last_contacted_at: leadRecord?.last_contacted_at || null,
          tags: leadRecord?.tags || [],
          signup_date: p.created_at,
          last_active: p.updated_at,
          onboarding_completed: p.onboarding_completed || false,
          onboarding_progress: p.onboarding_progress || 0,
          saved_products: savedProducts,
          has_shopify: hasShopify,
          roadmap_progress: roadmap ? Math.round((roadmap.completed / roadmap.total) * 100) : 0,
          engagement_score: engagementScore,
          subscription_status: p.subscription_status,
        };
      });

      if (stage && stage !== 'all') {
        leads = leads.filter((l: any) => l.stage === stage);
      }
      if (priority && priority !== 'all') {
        leads = leads.filter((l: any) => l.priority === priority);
      }
      if (search) {
        const s = search.toLowerCase();
        leads = leads.filter((l: any) =>
          (l.full_name && l.full_name.toLowerCase().includes(s)) ||
          (l.email && l.email.toLowerCase().includes(s))
        );
      }

      const stats = {
        total: leads.length,
        new_lead: leads.filter((l: any) => l.stage === 'new_lead').length,
        engaged: leads.filter((l: any) => l.stage === 'engaged').length,
        pitched: leads.filter((l: any) => l.stage === 'pitched').length,
        converted: leads.filter((l: any) => l.stage === 'converted').length,
        churned: leads.filter((l: any) => l.stage === 'churned').length,
        avgEngagement: leads.length > 0
          ? Math.round(leads.reduce((sum: number, l: any) => sum + l.engagement_score, 0) / leads.length)
          : 0,
        conversionRate: leads.length > 0
          ? Math.round((leads.filter((l: any) => l.stage === 'converted').length / leads.length) * 100)
          : 0,
      };

      return res.json({ leads, stats });
    } catch (error) {
      console.error('Error in leads API:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/leads', async (req: Request, res: Response) => {
    try {
      const { user_id, stage, priority, notes, source, last_contacted_at, tags } = req.body;

      if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
      }

      const validStages = ['new_lead', 'engaged', 'pitched', 'converted', 'churned'];
      const validPriorities = ['low', 'medium', 'high'];
      const validSources = ['organic', 'referral', 'campaign', 'manual'];

      if (stage && !validStages.includes(stage)) {
        return res.status(400).json({ error: 'Invalid stage value' });
      }
      if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority value' });
      }
      if (source && !validSources.includes(source)) {
        return res.status(400).json({ error: 'Invalid source value' });
      }

      const updateData: any = { updated_at: new Date().toISOString() };
      if (stage) updateData.stage = stage;
      if (priority) updateData.priority = priority;
      if (notes !== undefined) updateData.notes = notes;
      if (source) updateData.source = source;
      if (last_contacted_at !== undefined) updateData.last_contacted_at = last_contacted_at;
      if (tags !== undefined) updateData.tags = tags;

      const upsertData: any = {
        user_id,
        stage: stage || 'new_lead',
        source: source || 'organic',
        priority: priority || 'medium',
        ...updateData,
      };

      const { data, error } = await supabaseAdmin
        .from('leads')
        .upsert(upsertData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        console.error('Error updating lead:', error);
        return res.status(500).json({ error: 'Failed to update lead' });
      }

      return res.json({ lead: data });
    } catch (error) {
      console.error('Error in leads PATCH:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================
  // PLANS
  // =============================================
  function mapPlanFromDB(data: any) {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      priceMonthly: Number(data.price_monthly),
      priceAnnual: data.price_annual ? Number(data.price_annual) : null,
      priceYearly: data.price_yearly ? Number(data.price_yearly) : null,
      features: data.features || [],
      popular: data.popular || false,
      active: data.active ?? true,
      isPublic: data.is_public ?? true,
      displayOrder: data.display_order ?? 0,
      keyPointers: data.key_pointers,
      trialDays: data.trial_days ?? 0,
      createdAt: data.created_at ? new Date(data.created_at) : null,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    };
  }

  function validatePlanSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9_-]+$/;
    return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
  }

  router.get('/plans', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('subscription_plans')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching plans:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!data || data.length === 0) {
        return res.json([]);
      }

      const plans = data.map((plan: any) => mapPlanFromDB(plan));

      return res.json(plans);
    } catch (error) {
      console.error('Error in GET /api/admin/plans:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/plans', async (req: Request, res: Response) => {
    try {
      const {
        name,
        slug,
        description,
        priceMonthly,
        priceAnnual,
        priceYearly,
        features = [],
        popular = false,
        active = true,
        isPublic = true,
        displayOrder = 0,
        keyPointers,
        trialDays = 0,
      } = req.body;

      if (!name || !slug) {
        return res.status(400).json({ error: 'Name and slug are required' });
      }

      if (priceMonthly === undefined || priceMonthly === null) {
        return res.status(400).json({ error: 'Monthly price is required' });
      }

      if (!validatePlanSlug(slug)) {
        return res.status(400).json({ error: 'Invalid slug format. Must be lowercase alphanumeric with hyphens or underscores' });
      }

      const { data: existingPlan } = await supabaseAdmin
        .from('subscription_plans')
        .select('id')
        .eq('slug', slug)
        .limit(1);

      if (existingPlan && existingPlan.length > 0) {
        return res.status(409).json({ error: 'A plan with this slug already exists' });
      }

      if (!Array.isArray(features)) {
        return res.status(400).json({ error: 'Features must be an array' });
      }

      if (priceMonthly < 0 || (priceAnnual !== null && priceAnnual !== undefined && priceAnnual < 0) ||
          (priceYearly !== null && priceYearly !== undefined && priceYearly < 0)) {
        return res.status(400).json({ error: 'Prices must be non-negative' });
      }

      if (trialDays < 0) {
        return res.status(400).json({ error: 'Trial days must be non-negative' });
      }

      const now = new Date().toISOString();

      const { data: result, error: insertError } = await supabaseAdmin
        .from('subscription_plans')
        .insert({
          name,
          slug,
          description: description || null,
          price_monthly: priceMonthly,
          price_annual: priceAnnual ?? null,
          price_yearly: priceYearly ?? null,
          features,
          popular: popular || false,
          active: active ?? true,
          is_public: isPublic ?? true,
          display_order: displayOrder ?? 0,
          key_pointers: keyPointers || null,
          trial_days: trialDays ?? 0,
          updated_at: now,
        })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          return res.status(409).json({ error: 'A plan with this name or slug already exists' });
        }
        console.error('Error creating plan:', insertError);
        return res.status(500).json({ error: 'Failed to create plan' });
      }

      if (!result) {
        return res.status(500).json({ error: 'Failed to create plan' });
      }

      const plan = mapPlanFromDB(result);
      return res.status(201).json(plan);
    } catch (error) {
      console.error('Error in POST /api/admin/plans:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/plans/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('subscription_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      const plan = mapPlanFromDB(data);
      return res.json(plan);
    } catch (error) {
      console.error('Error in GET /api/admin/plans/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/plans/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const body = req.body;

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (body.name !== undefined) updateData.name = body.name;
      if (body.slug !== undefined) {
        if (!validatePlanSlug(body.slug)) {
          return res.status(400).json({ error: 'Invalid slug format. Must be lowercase alphanumeric with hyphens or underscores' });
        }
        updateData.slug = body.slug;
      }
      if (body.description !== undefined) updateData.description = body.description || null;
      if (body.priceMonthly !== undefined) {
        if (body.priceMonthly < 0) {
          return res.status(400).json({ error: 'Monthly price must be non-negative' });
        }
        updateData.price_monthly = body.priceMonthly;
      }
      if (body.priceAnnual !== undefined) {
        if (body.priceAnnual !== null && body.priceAnnual < 0) {
          return res.status(400).json({ error: 'Annual price must be non-negative' });
        }
        updateData.price_annual = body.priceAnnual ?? null;
      }
      if (body.priceYearly !== undefined) {
        if (body.priceYearly !== null && body.priceYearly < 0) {
          return res.status(400).json({ error: 'Yearly price must be non-negative' });
        }
        updateData.price_yearly = body.priceYearly ?? null;
      }
      if (body.features !== undefined) {
        if (!Array.isArray(body.features)) {
          return res.status(400).json({ error: 'Features must be an array' });
        }
        updateData.features = body.features;
      }
      if (body.popular !== undefined) updateData.popular = body.popular;
      if (body.active !== undefined) updateData.active = body.active;
      if (body.isPublic !== undefined) updateData.is_public = body.isPublic;
      if (body.displayOrder !== undefined) updateData.display_order = body.displayOrder;
      if (body.keyPointers !== undefined) updateData.key_pointers = body.keyPointers || null;
      if (body.trialDays !== undefined) {
        if (body.trialDays < 0) {
          return res.status(400).json({ error: 'Trial days must be non-negative' });
        }
        updateData.trial_days = body.trialDays;
      }

      if (updateData.slug) {
        const { data: existingPlan } = await supabaseAdmin
          .from('subscription_plans')
          .select('id')
          .eq('slug', updateData.slug)
          .neq('id', id)
          .limit(1);

        if (existingPlan && existingPlan.length > 0) {
          return res.status(409).json({ error: 'A plan with this slug already exists' });
        }
      }

      const { data: result, error: updateError } = await supabaseAdmin
        .from('subscription_plans')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        if (updateError.code === '23505') {
          return res.status(409).json({ error: 'A plan with this name or slug already exists' });
        }
        return res.status(404).json({ error: 'Plan not found' });
      }

      if (!result) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      const plan = mapPlanFromDB(result);
      return res.json(plan);
    } catch (error) {
      console.error('Error in PATCH /api/admin/plans/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/plans/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data: profiles } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('subscription_plan_id', id)
        .limit(1);

      if (profiles && profiles.length > 0) {
        const now = new Date().toISOString();
        const { data: result, error } = await supabaseAdmin
          .from('subscription_plans')
          .update({ active: false, updated_at: now })
          .eq('id', id)
          .select()
          .single();

        if (error || !result) {
          return res.status(404).json({ error: 'Plan not found' });
        }

        return res.json({
          success: true,
          message: 'Plan deactivated (in use by users)',
          plan: mapPlanFromDB(result),
        });
      }

      const { data: deleteResult, error: deleteError } = await supabaseAdmin
        .from('subscription_plans')
        .delete()
        .eq('id', id)
        .select('id');

      if (deleteError || !deleteResult || deleteResult.length === 0) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      return res.json({ success: true, message: 'Plan deleted successfully' });
    } catch (error) {
      console.error('Error in DELETE /api/admin/plans/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================
  // PRODUCTS
  // =============================================
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  function isValidUUID(id: string | undefined): boolean {
    return !!id && UUID_REGEX.test(id);
  }

  function mapRowToProduct(row: any) {
    const cat = row.categories;
    const sup = row.suppliers;
    const meta = Array.isArray(row.product_metadata) ? row.product_metadata[0] : row.product_metadata;
    const src = Array.isArray(row.product_source) ? row.product_source[0] : row.product_source;

    return {
      id: row.id,
      title: row.title,
      image: row.image,
      description: row.description,
      category_id: row.category_id,
      category: cat ? {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        parent_category_id: cat.parent_category_id,
        trending: cat.trending,
        product_count: cat.product_count,
        avg_profit_margin: cat.avg_profit_margin,
        growth_percentage: cat.growth_percentage,
        created_at: cat.created_at,
        updated_at: cat.updated_at,
      } : null,
      buy_price: parseFloat(row.buy_price),
      sell_price: parseFloat(row.sell_price),
      profit_per_order: parseFloat(row.profit_per_order),
      additional_images: row.additional_images || [],
      specifications: row.specifications,
      rating: row.rating ? parseFloat(row.rating) : null,
      reviews_count: row.reviews_count || 0,
      trend_data: row.trend_data || [],
      supplier_id: row.supplier_id,
      supplier: sup ? {
        id: sup.id,
        name: sup.name,
        company_name: sup.name,
        logo: null,
        website: sup.website,
        country: sup.country,
        rating: sup.rating,
        verified: sup.verified,
        shipping_time: sup.shipping_time,
        min_order_quantity: sup.min_order_quantity,
        contact_email: sup.contact_email,
        created_at: sup.created_at,
        updated_at: sup.updated_at,
      } : null,
      created_at: row.created_at,
      updated_at: row.updated_at,
      metadata: meta ? {
        id: meta.id,
        product_id: row.id,
        is_winning: meta.is_winning || false,
        is_locked: meta.is_locked || false,
        unlock_price: meta.unlock_price ? parseFloat(meta.unlock_price) : null,
        profit_margin: meta.profit_margin ? parseFloat(meta.profit_margin) : null,
        pot_revenue: meta.pot_revenue ? parseFloat(meta.pot_revenue) : null,
        revenue_growth_rate: meta.revenue_growth_rate ? parseFloat(meta.revenue_growth_rate) : null,
        items_sold: meta.items_sold,
        avg_unit_price: meta.avg_unit_price ? parseFloat(meta.avg_unit_price) : null,
        revenue_trend: meta.revenue_trend || [],
        found_date: meta.found_date,
        detailed_analysis: meta.detailed_analysis,
        filters: meta.filters || [],
        created_at: meta.created_at,
        updated_at: meta.updated_at,
      } : undefined,
      source: src ? {
        id: src.id,
        product_id: row.id,
        source_type: src.source_type,
        source_id: src.source_id,
        standardized_at: src.standardized_at,
        standardized_by: src.standardized_by,
        created_at: src.created_at,
        updated_at: src.updated_at,
      } : undefined,
    };
  }

  async function fetchCompleteProduct(id: string) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories(*),
        suppliers(*),
        product_metadata(*),
        product_source(*)
      `)
      .eq('id', id)
      .single();

    return { data, error };
  }

  router.get('/products', async (req: Request, res: Response) => {
    try {
      const sourceType = req.query.source_type as string | undefined;
      const isWinning = req.query.is_winning as string | undefined;
      const isLocked = req.query.is_locked as string | undefined;
      const categoryId = req.query.category_id as string | undefined;
      const search = req.query.search as string | undefined;
      const page = parseInt((req.query.page as string) || '1');
      const pageSize = parseInt((req.query.pageSize as string) || '20');
      const sortBy = (req.query.sortBy as string) || 'created_at';
      const sortOrder = (req.query.sortOrder as string) || 'desc';

      let countQuery = supabaseAdmin
        .from('products')
        .select('id, product_metadata!left(is_winning, is_locked), product_source!left(source_type)', { count: 'exact', head: true });

      if (categoryId) countQuery = countQuery.eq('category_id', categoryId);
      if (search) countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

      const { count: total } = await countQuery;

      const offset = (page - 1) * pageSize;

      let dataQuery = supabaseAdmin
        .from('products')
        .select(`
          *,
          categories(*),
          suppliers(*),
          product_metadata(*),
          product_source(*)
        `);

      if (categoryId) dataQuery = dataQuery.eq('category_id', categoryId);
      if (search) dataQuery = dataQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

      const orderColumn = sortBy === 'profit_per_order' ? 'profit_per_order' :
                         sortBy === 'sell_price' ? 'sell_price' :
                         sortBy === 'rating' ? 'rating' :
                         'created_at';

      dataQuery = dataQuery.order(orderColumn, { ascending: sortOrder === 'asc', nullsFirst: false });
      dataQuery = dataQuery.range(offset, offset + pageSize - 1);

      const { data, error } = await dataQuery;

      if (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      let filteredData = data || [];

      if (sourceType) {
        filteredData = filteredData.filter((row: any) => {
          const src = Array.isArray(row.product_source) ? row.product_source[0] : row.product_source;
          return src?.source_type === sourceType;
        });
      }
      if (isWinning !== null && isWinning !== undefined) {
        filteredData = filteredData.filter((row: any) => {
          const meta = Array.isArray(row.product_metadata) ? row.product_metadata[0] : row.product_metadata;
          return meta?.is_winning === (isWinning === 'true');
        });
      }
      if (isLocked !== null && isLocked !== undefined) {
        filteredData = filteredData.filter((row: any) => {
          const meta = Array.isArray(row.product_metadata) ? row.product_metadata[0] : row.product_metadata;
          return meta?.is_locked === (isLocked === 'true');
        });
      }

      const products = filteredData.map((row: any) => {
        const cat = row.categories;
        const sup = row.suppliers;
        const meta = Array.isArray(row.product_metadata) ? row.product_metadata[0] : row.product_metadata;
        const src = Array.isArray(row.product_source) ? row.product_source[0] : row.product_source;

        return {
          id: row.id,
          title: row.title,
          image: row.image,
          description: row.description,
          category_id: row.category_id,
          category: cat ? {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            image: cat.image,
            thumbnail: cat.thumbnail || null,
            parent_category_id: cat.parent_category_id,
            trending: cat.trending,
            product_count: cat.product_count,
            avg_profit_margin: cat.avg_profit_margin,
            growth_percentage: cat.growth_percentage,
            created_at: cat.created_at,
            updated_at: cat.updated_at,
          } : undefined,
          buy_price: parseFloat(row.buy_price),
          sell_price: parseFloat(row.sell_price),
          profit_per_order: parseFloat(row.profit_per_order),
          additional_images: row.additional_images || [],
          specifications: row.specifications,
          rating: row.rating ? parseFloat(row.rating) : null,
          reviews_count: row.reviews_count || 0,
          trend_data: row.trend_data || [],
          supplier_id: row.supplier_id,
          supplier: sup ? {
            id: sup.id,
            name: sup.name,
            company_name: sup.name || null,
            logo: null,
            website: sup.website,
            country: sup.country,
            rating: sup.rating,
            verified: sup.verified,
            shipping_time: sup.shipping_time,
            min_order_quantity: sup.min_order_quantity,
            contact_email: sup.contact_email,
            created_at: sup.created_at,
            updated_at: sup.updated_at,
          } : undefined,
          created_at: row.created_at,
          updated_at: row.updated_at,
          metadata: meta ? {
            id: meta.id,
            product_id: meta.product_id,
            is_winning: meta.is_winning || false,
            is_locked: meta.is_locked || false,
            unlock_price: meta.unlock_price ? parseFloat(meta.unlock_price) : null,
            profit_margin: meta.profit_margin ? parseFloat(meta.profit_margin) : null,
            pot_revenue: meta.pot_revenue ? parseFloat(meta.pot_revenue) : null,
            revenue_growth_rate: meta.revenue_growth_rate ? parseFloat(meta.revenue_growth_rate) : null,
            items_sold: meta.items_sold,
            avg_unit_price: meta.avg_unit_price ? parseFloat(meta.avg_unit_price) : null,
            revenue_trend: meta.revenue_trend || [],
            found_date: meta.found_date,
            detailed_analysis: meta.detailed_analysis,
            filters: meta.filters || [],
            created_at: meta.created_at,
            updated_at: meta.updated_at,
          } : undefined,
          source: src ? {
            id: src.id,
            product_id: src.product_id,
            source_type: src.source_type,
            source_id: src.source_id,
            standardized_at: src.standardized_at,
            standardized_by: src.standardized_by,
            created_at: src.created_at,
            updated_at: src.updated_at,
          } : undefined,
        };
      });

      const totalCount = total || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      return res.json({
        products,
        total: totalCount,
        page,
        pageSize,
        totalPages,
      });
    } catch (error) {
      console.error('Unexpected error fetching products:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/products', async (req: Request, res: Response) => {
    try {
      const {
        title,
        image,
        description,
        category_id,
        buy_price,
        sell_price,
        additional_images,
        specifications,
        rating,
        reviews_count,
        trend_data,
        supplier_id,
        metadata,
        source,
      } = req.body;

      if (!title || !image || !buy_price || !sell_price) {
        return res.status(400).json({ error: 'Missing required fields: title, image, buy_price, sell_price' });
      }

      const calculatedProfit = parseFloat(sell_price) - parseFloat(buy_price);

      const { data: product, error: productError } = await supabaseRemote
        .from('products')
        .insert({
          title,
          image,
          description: description || null,
          category_id: category_id || null,
          buy_price,
          sell_price,
          profit_per_order: calculatedProfit,
          additional_images: additional_images || [],
          specifications: specifications || null,
          rating: rating || null,
          reviews_count: reviews_count || 0,
          trend_data: trend_data || [],
          supplier_id: supplier_id || null,
        })
        .select()
        .single();

      if (productError || !product) {
        console.error('Error creating product:', productError);
        return res.status(500).json({ error: 'Failed to create product', details: 'Insert returned no rows' });
      }

      if (metadata && product) {
        await supabaseRemote.from('product_metadata').insert({
          product_id: product.id,
          is_winning: metadata.is_winning || false,
          is_locked: metadata.is_locked || false,
          unlock_price: metadata.unlock_price || null,
          profit_margin: metadata.profit_margin || null,
          pot_revenue: metadata.pot_revenue || null,
          revenue_growth_rate: metadata.revenue_growth_rate || null,
          items_sold: metadata.items_sold || null,
          avg_unit_price: metadata.avg_unit_price || null,
          revenue_trend: metadata.revenue_trend || [],
          found_date: metadata.found_date || null,
          detailed_analysis: metadata.detailed_analysis || null,
          filters: metadata.filters || [],
        });
      }

      if (source && product) {
        await supabaseRemote.from('product_source').insert({
          product_id: product.id,
          source_type: source.source_type || null,
          source_id: source.source_id || null,
          standardized_at: source.standardized_at || null,
          standardized_by: source.standardized_by || null,
        });
      }

      const { data: completeProduct } = await supabaseRemote
        .from('products')
        .select(`
          *,
          categories(id, name, slug),
          suppliers(id, name),
          product_metadata(*),
          product_source(*)
        `)
        .eq('id', product.id)
        .single();

      return res.status(201).json({ product: completeProduct || product });
    } catch (error) {
      console.error('Unexpected error creating product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/products/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id || !isValidUUID(id)) {
        return res.status(400).json({ error: 'Invalid product ID', details: 'Product ID is required and must be a valid UUID' });
      }

      const { data, error } = await fetchCompleteProduct(id);

      if (error || !data) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const product = mapRowToProduct(data);

      return res.json({ product });
    } catch (error) {
      console.error('Unexpected error fetching product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/products/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id || !isValidUUID(id)) {
        return res.status(400).json({ error: 'Invalid product ID', details: 'Product ID is required and must be a valid UUID' });
      }

      const {
        title,
        image,
        description,
        category_id,
        buy_price,
        sell_price,
        additional_images,
        specifications,
        rating,
        reviews_count,
        trend_data,
        supplier_id,
        metadata,
        source,
      } = req.body;

      const updateData: Record<string, any> = {};

      if (title !== undefined) updateData.title = title;
      if (image !== undefined) updateData.image = image;
      if (description !== undefined) updateData.description = description;
      if (category_id !== undefined) updateData.category_id = category_id;
      if (buy_price !== undefined) updateData.buy_price = buy_price;
      if (sell_price !== undefined) updateData.sell_price = sell_price;
      if (buy_price !== undefined || sell_price !== undefined) {
        const newBuy = buy_price !== undefined ? parseFloat(buy_price) : null;
        const newSell = sell_price !== undefined ? parseFloat(sell_price) : null;
        if (newBuy !== null && newSell !== null) {
          updateData.profit_per_order = newSell - newBuy;
        }
      }
      if (additional_images !== undefined) updateData.additional_images = additional_images;
      if (specifications !== undefined) updateData.specifications = specifications || null;
      if (rating !== undefined) updateData.rating = rating;
      if (reviews_count !== undefined) updateData.reviews_count = reviews_count;
      if (trend_data !== undefined) updateData.trend_data = trend_data;
      if (supplier_id !== undefined) updateData.supplier_id = supplier_id;

      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date().toISOString();

        const { error: updateError } = await supabaseAdmin
          .from('products')
          .update(updateData)
          .eq('id', id);

        if (updateError) {
          return res.status(500).json({ error: 'Failed to update product', details: 'Product not found or no rows updated' });
        }
      }

      if (metadata) {
        try {
          const metaUpdate: Record<string, any> = {};
          const metaColumns = ['is_winning', 'is_locked', 'unlock_price', 'profit_margin', 'pot_revenue', 'revenue_growth_rate', 'items_sold', 'avg_unit_price', 'revenue_trend', 'found_date', 'detailed_analysis', 'filters'];

          for (const col of metaColumns) {
            if (metadata[col] !== undefined) {
              metaUpdate[col] = metadata[col];
            }
          }

          if (Object.keys(metaUpdate).length > 0) {
            metaUpdate.updated_at = new Date().toISOString();
            const { data: existingMeta } = await supabaseAdmin
              .from('product_metadata')
              .select('id')
              .eq('product_id', id)
              .single();

            if (existingMeta) {
              await supabaseAdmin
                .from('product_metadata')
                .update(metaUpdate)
                .eq('product_id', id);
            } else {
              await supabaseAdmin
                .from('product_metadata')
                .insert({ product_id: id, ...metaUpdate });
            }
          }
        } catch (metaError) {
          console.error('Error updating product metadata:', metaError);
        }
      }

      if (source) {
        try {
          const srcUpdate: Record<string, any> = {};
          const srcColumns = ['source_type', 'source_id', 'standardized_at', 'standardized_by'];

          for (const col of srcColumns) {
            if (source[col] !== undefined) {
              srcUpdate[col] = source[col];
            }
          }

          if (Object.keys(srcUpdate).length > 0) {
            srcUpdate.updated_at = new Date().toISOString();
            const { data: existingSrc } = await supabaseAdmin
              .from('product_source')
              .select('id')
              .eq('product_id', id)
              .single();

            if (existingSrc) {
              await supabaseAdmin
                .from('product_source')
                .update(srcUpdate)
                .eq('product_id', id);
            } else {
              await supabaseAdmin
                .from('product_source')
                .insert({ product_id: id, ...srcUpdate });
            }
          }
        } catch (sourceError) {
          console.error('Error updating product source:', sourceError);
        }
      }

      const { data: completeResult, error: fetchError } = await fetchCompleteProduct(id);

      if (fetchError || !completeResult) {
        return res.status(404).json({ error: 'Product not found after update' });
      }

      const product = mapRowToProduct(completeResult);

      return res.json({ product });
    } catch (error) {
      console.error('Unexpected error updating product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/products/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id || !isValidUUID(id)) {
        return res.status(400).json({ error: 'Invalid product ID', details: 'Product ID is required and must be a valid UUID' });
      }

      await supabaseRemote.from('product_metadata').delete().eq('product_id', id);
      await supabaseRemote.from('product_source').delete().eq('product_id', id);
      await supabaseRemote.from('products').delete().eq('id', id);

      return res.json({ success: true });
    } catch (error) {
      console.error('Unexpected error deleting product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================
  // SHOPIFY STORES
  // =============================================
  function mapShopifyStoreFromDB(data: any) {
    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      url: data.url,
      logo: data.logo || undefined,
      status: data.status,
      connected_at: data.connected_at || new Date().toISOString(),
      last_synced_at: data.last_synced_at,
      sync_status: data.sync_status,
      api_key: data.api_key || "",
      access_token: data.access_token || "",
      products_count: data.products_count || 0,
      monthly_revenue: data.monthly_revenue ? Number(data.monthly_revenue) : null,
      monthly_traffic: data.monthly_traffic || null,
      niche: data.niche || null,
      country: data.country || null,
      currency: data.currency || "USD",
      plan: data.plan,
      user: data.profiles
        ? {
            id: data.profiles.id,
            email: data.profiles.email,
            full_name: data.profiles.full_name,
          }
        : undefined,
      created_at: data.created_at,
      updated_at: data.updated_at,
      connectedAt: data.connected_at || undefined,
    };
  }

  function mapShopifyStoreToDB(store: any) {
    const dbStore: Record<string, any> = {};

    if (store.name !== undefined) dbStore.name = store.name;
    if (store.url !== undefined) dbStore.url = store.url;
    if (store.logo !== undefined) dbStore.logo = store.logo || null;
    if (store.status !== undefined) dbStore.status = store.status;
    if (store.connected_at !== undefined) dbStore.connected_at = store.connected_at || null;
    if (store.last_synced_at !== undefined) dbStore.last_synced_at = store.last_synced_at || null;
    if (store.sync_status !== undefined) dbStore.sync_status = store.sync_status;
    if (store.api_key !== undefined) dbStore.api_key = store.api_key || null;
    if (store.access_token !== undefined) dbStore.access_token = store.access_token || null;
    if (store.products_count !== undefined) dbStore.products_count = store.products_count;
    if (store.monthly_revenue !== undefined) dbStore.monthly_revenue = store.monthly_revenue ?? null;
    if (store.monthly_traffic !== undefined) dbStore.monthly_traffic = store.monthly_traffic || null;
    if (store.niche !== undefined) dbStore.niche = store.niche || null;
    if (store.country !== undefined) dbStore.country = store.country || null;
    if (store.currency !== undefined) dbStore.currency = store.currency;
    if (store.plan !== undefined) dbStore.plan = store.plan;

    return dbStore;
  }

  function normalizeShopifyStoreUrl(url: string): string {
    let normalized = url.trim().toLowerCase();
    normalized = normalized.replace(/^https?:\/\//, "");
    normalized = normalized.replace(/\/$/, "");
    if (!normalized.includes(".")) {
      normalized = `${normalized}.myshopify.com`;
    } else if (!normalized.includes(".myshopify.com")) {
      const match = normalized.match(/^([a-zA-Z0-9-]+)/);
      if (match) {
        normalized = `${match[1]}.myshopify.com`;
      }
    }
    return normalized;
  }

  function validateShopifyStoreUrl(url: string): boolean {
    if (!url || !url.trim()) return false;
    const normalized = normalizeShopifyStoreUrl(url);
    const shopifyPattern = /^[a-zA-Z0-9-]+\.myshopify\.com$/;
    return shopifyPattern.test(normalized);
  }

  router.get('/shopify-stores', async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const userId = req.query.user_id as string | undefined;
      const search = req.query.search as string | undefined;
      const page = parseInt((req.query.page as string) || '1');
      const pageSize = parseInt((req.query.pageSize as string) || '50');
      const sortBy = (req.query.sortBy as string) || 'created_at';
      const sortOrder = (req.query.sortOrder as string) || 'desc';

      let countQuery = supabaseAdmin.from('shopify_stores').select('*', { count: 'exact', head: true });
      let dataQuery = supabaseAdmin.from('shopify_stores').select('*, profiles(id, email, full_name)');

      if (status) {
        countQuery = countQuery.eq('status', status);
        dataQuery = dataQuery.eq('status', status);
      }
      if (userId) {
        countQuery = countQuery.eq('user_id', userId);
        dataQuery = dataQuery.eq('user_id', userId);
      }
      if (search) {
        countQuery = countQuery.or(`name.ilike.%${search}%,url.ilike.%${search}%`);
        dataQuery = dataQuery.or(`name.ilike.%${search}%,url.ilike.%${search}%`);
      }

      const allowedSortColumns = ['created_at', 'updated_at', 'name', 'url', 'status', 'products_count'];
      const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';

      dataQuery = dataQuery.order(safeSortBy, { ascending: sortOrder === 'asc' });

      const offset = (page - 1) * pageSize;
      dataQuery = dataQuery.range(offset, offset + pageSize - 1);

      const [{ count: totalCount }, { data, error }] = await Promise.all([countQuery, dataQuery]);

      if (error) {
        console.error('Error fetching shopify stores:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const total = totalCount || 0;

      if (!data || data.length === 0) {
        return res.json({
          stores: [],
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        });
      }

      const stores = data.map((row: any) => mapShopifyStoreFromDB(row));

      return res.json({
        stores,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      });
    } catch (error) {
      console.error('Error in GET /api/admin/shopify-stores:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/shopify-stores/:id', async (req: Request, res: Response) => {
    try {
      const storeId = req.params.id;

      const { data, error } = await supabaseAdmin
        .from('shopify_stores')
        .select('*, profiles(id, email, full_name)')
        .eq('id', storeId)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Store not found' });
      }

      const store = mapShopifyStoreFromDB(data);

      return res.json(store);
    } catch (error) {
      console.error('Error in GET /api/admin/shopify-stores/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/shopify-stores/:id', async (req: Request, res: Response) => {
    try {
      const storeId = req.params.id;
      const body = req.body;

      if (body.url) {
        if (!validateShopifyStoreUrl(body.url)) {
          return res.status(400).json({ error: 'Invalid Shopify store URL format' });
        }
        body.url = normalizeShopifyStoreUrl(body.url);
      }

      if (body.status && !['connected', 'disconnected', 'syncing', 'error'].includes(body.status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      if (body.sync_status && !['success', 'failed', 'pending', 'never'].includes(body.sync_status)) {
        return res.status(400).json({ error: 'Invalid sync_status value' });
      }

      if (body.plan && !['basic', 'shopify', 'advanced', 'plus'].includes(body.plan)) {
        return res.status(400).json({ error: 'Invalid plan value' });
      }

      const updateData = mapShopifyStoreToDB(body);
      updateData.updated_at = new Date().toISOString();

      if (Object.keys(updateData).length <= 1) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const { data: result, error: updateError } = await supabaseAdmin
        .from('shopify_stores')
        .update(updateData)
        .eq('id', storeId)
        .select('*, profiles(id, email, full_name)')
        .single();

      if (updateError) {
        if (updateError.code === '23505') {
          return res.status(409).json({ error: 'A store with this URL already exists' });
        }
        return res.status(404).json({ error: 'Store not found' });
      }

      if (!result) {
        return res.status(404).json({ error: 'Store not found' });
      }

      const store = mapShopifyStoreFromDB(result);

      return res.json(store);
    } catch (error) {
      console.error('Error in PATCH /api/admin/shopify-stores/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/shopify-stores/:id', async (req: Request, res: Response) => {
    try {
      const storeId = req.params.id;

      const { data: existing } = await supabaseAdmin
        .from('shopify_stores')
        .select('id')
        .eq('id', storeId)
        .single();

      if (!existing) {
        return res.status(404).json({ error: 'Store not found' });
      }

      await supabaseAdmin.from('shopify_stores').delete().eq('id', storeId);

      return res.json({ success: true, message: 'Store deleted successfully' });
    } catch (error) {
      console.error('Error in DELETE /api/admin/shopify-stores/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================
  // SUPPLIERS
  // =============================================
  router.get('/suppliers', async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string | undefined;
      const verified = req.query.verified as string | undefined;

      let query = supabaseRemote.from('suppliers').select('*');

      if (search) {
        query = query.or(`name.ilike.%${search}%,country.ilike.%${search}%,contact_email.ilike.%${search}%`);
      }
      if (verified === 'true') {
        query = query.eq('verified', true);
      } else if (verified === 'false') {
        query = query.eq('verified', false);
      }

      query = query.order('created_at', { ascending: false });

      const { data: suppliers, error } = await query;

      if (error) {
        console.error('Error fetching suppliers:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      return res.json({ suppliers: suppliers || [] });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/suppliers', async (req: Request, res: Response) => {
    try {
      const { name, website, country, rating, verified, shipping_time, min_order_quantity, contact_email } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Supplier name is required' });
      }

      const { data: supplier, error } = await supabaseRemote
        .from('suppliers')
        .insert({
          name,
          website: website || null,
          country: country || null,
          rating: rating || 0,
          verified: verified || false,
          shipping_time: shipping_time || null,
          min_order_quantity: min_order_quantity || 1,
          contact_email: contact_email || null,
        })
        .select()
        .single();

      if (error || !supplier) {
        console.error('Error creating supplier:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      return res.status(201).json({ supplier });
    } catch (error) {
      console.error('Error creating supplier:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/suppliers/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Supplier not found' });
      }

      return res.json({ supplier: data });
    } catch (error) {
      console.error('Error fetching supplier:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/suppliers/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, website, country, rating, verified, shipping_time, min_order_quantity, contact_email } = req.body;

      const updateData: Record<string, any> = {};

      if (name !== undefined) updateData.name = name;
      if (website !== undefined) updateData.website = website;
      if (country !== undefined) updateData.country = country;
      if (rating !== undefined) updateData.rating = rating;
      if (verified !== undefined) updateData.verified = verified;
      if (shipping_time !== undefined) updateData.shipping_time = shipping_time;
      if (min_order_quantity !== undefined) updateData.min_order_quantity = min_order_quantity;
      if (contact_email !== undefined) updateData.contact_email = contact_email;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updateData.updated_at = new Date().toISOString();

      const { data: supplier, error } = await supabaseRemote
        .from('suppliers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }

      return res.json({ supplier });
    } catch (error) {
      console.error('Error updating supplier:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/suppliers/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await supabaseRemote.from('suppliers').delete().eq('id', id);

      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================
  // USER DETAILS
  // =============================================
  router.get('/user-details/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('user_details')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!data) {
        return res.status(404).json({ error: 'User details not found' });
      }

      return res.json(data);
    } catch (error) {
      console.error('Error in GET /api/admin/user-details/[userId]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.put('/user-details/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const body = req.body;

      const { data, error } = await supabaseAdmin
        .from('user_details')
        .upsert(
          {
            ...body,
            user_id: userId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) {
        console.error('Error upserting user details:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      return res.json(data);
    } catch (error) {
      console.error('Error in PUT /api/admin/user-details/[userId]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================
  // USER PROGRESS
  // =============================================
  router.get('/user-progress/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const [
        roadmapResult,
        onboardingResult,
        userDetailsResult,
        credentialsResult,
        courseNotesResult,
      ] = await Promise.all([
        supabaseAdmin
          .from('roadmap_progress')
          .select('*')
          .eq('user_id', userId),

        supabaseAdmin
          .from('onboarding_progress')
          .select('*, onboarding_videos(*)')
          .eq('user_id', userId),

        supabaseAdmin
          .from('user_details')
          .select('*')
          .eq('user_id', userId),

        supabaseAdmin
          .from('user_credentials')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),

        supabaseAdmin
          .from('course_notes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
      ]);

      return res.json({
        roadmapProgress: roadmapResult.data ?? [],
        onboardingProgress: onboardingResult.data ?? [],
        userDetails: userDetailsResult.data ?? [],
        credentialsCount: credentialsResult.count ?? 0,
        courseNotesCount: courseNotesResult.count ?? 0,
      });
    } catch (error) {
      console.error('Error in GET /api/admin/user-progress/[userId]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/admin', router);
}
