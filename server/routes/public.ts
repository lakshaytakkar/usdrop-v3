import { type Express, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { supabaseRemote } from '../lib/supabase-remote';
import { requireAuth, optionalAuth } from '../lib/auth';
import * as fs from 'fs';
import * as path from 'path';

export function registerPublicRoutes(app: Express) {

  // ==================== CATEGORIES ====================

  // GET /api/categories
  app.get('/api/categories', async (req: Request, res: Response) => {
    try {
      const parentCategoryId = req.query.parent_category_id as string | undefined;
      const trending = req.query.trending as string | undefined;
      const search = req.query.search as string | undefined;
      const includeSubcategories = req.query.include_subcategories === 'true';

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

      query = query.order('growth_percentage', { ascending: false, nullsFirst: false })
        .order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ error: 'Failed to fetch categories' });
      }

      let categories = (data || []).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        thumbnail: cat.thumbnail,
        parent_category_id: cat.parent_category_id,
        trending: cat.trending || false,
        product_count: cat.product_count || 0,
        avg_profit_margin: cat.avg_profit_margin ? parseFloat(cat.avg_profit_margin) : null,
        growth_percentage: cat.growth_percentage ? parseFloat(cat.growth_percentage) : null,
        created_at: cat.created_at,
        updated_at: cat.updated_at,
      }));

      if (includeSubcategories) {
        const parentIds = categories.map((c: any) => c.id);
        if (parentIds.length > 0) {
          const { data: subcategories } = await supabaseRemote
            .from('categories')
            .select('*')
            .in('parent_category_id', parentIds)
            .order('name', { ascending: true });

          if (subcategories) {
            categories = categories.map((cat: any) => ({
              ...cat,
              subcategories: subcategories
                .filter((sub: any) => sub.parent_category_id === cat.id)
                .map((sub: any) => ({
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
            }));
          }
        }
      }

      const parentIds = Array.from(new Set(categories
        .filter((c: any) => c.parent_category_id)
        .map((c: any) => c.parent_category_id!)));

      if (parentIds.length > 0) {
        const { data: parents } = await supabaseRemote
          .from('categories')
          .select('id, name, slug')
          .in('id', parentIds);

        if (parents) {
          categories = categories.map((cat: any) => ({
            ...cat,
            parent_category: cat.parent_category_id
              ? parents.find((p: any) => p.id === cat.parent_category_id)
              : undefined,
          }));
        }
      }

      return res.json({
        categories,
        total: categories.length,
      });
    } catch (error) {
      console.error('Unexpected error fetching categories:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/categories/:id
  app.get('/api/categories/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseRemote
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Category not found' });
      }

      let parentCategory = null;
      if (data.parent_category_id) {
        const { data: parentResult } = await supabaseRemote
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

  // POST /api/categories/update-images
  app.post('/api/categories/update-images', async (_req: Request, res: Response) => {
    try {
      const defaultCategoryMapping: Record<string, { name: string }> = {
        "beauty": { name: "Beauty" },
        "electronics": { name: "Electronics" },
        "fashion": { name: "Fashion" },
        "gadgets": { name: "Gadgets" },
        "home-decor": { name: "Home Decor" },
        "home-garden": { name: "Home & Garden" },
        "kitchen": { name: "Kitchen" },
        "mother-kids": { name: "Mother & Kids" },
        "other": { name: "Other" },
        "pets": { name: "Pets" },
        "sports-fitness": { name: "Sports & Fitness" }
      };

      let categoryMapping = defaultCategoryMapping;
      try {
        const mappingPath = path.join(process.cwd(), 'scripts', 'category-image-mapping.json');
        if (fs.existsSync(mappingPath)) {
          categoryMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
        }
      } catch (err) {
        console.warn('Could not load category mapping file, using defaults:', err);
      }

      const results: Array<{ slug: string; success: boolean; error?: string }> = [];

      for (const [slug, _category] of Object.entries(categoryMapping)) {
        const imageUrl = `/categories/${slug}.png`;

        try {
          const { data: existing } = await supabaseRemote
            .from('categories')
            .select('id, name, slug')
            .eq('slug', slug)
            .maybeSingle();

          if (!existing) {
            results.push({ slug, success: false, error: `Category with slug "${slug}" not found in database` });
            continue;
          }

          const { data, error } = await supabaseRemote
            .from('categories')
            .update({ image: imageUrl })
            .eq('id', existing.id)
            .select('id, name')
            .single();

          if (error) {
            results.push({ slug, success: false, error: error.message });
            continue;
          }

          results.push({ slug, success: true });
        } catch (err) {
          results.push({ slug, success: false, error: err instanceof Error ? err.message : 'Unknown error' });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;

      return res.json({
        message: 'Category images updated',
        results,
        summary: { total: results.length, success: successCount, errors: errorCount }
      });
    } catch (error) {
      console.error('Error updating category images:', error);
      return res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // ==================== COMPETITOR STORES ====================

  // GET /api/competitor-stores
  app.get('/api/competitor-stores', async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.category_id as string | undefined;
      const country = req.query.country as string | undefined;
      const search = req.query.search as string | undefined;
      const verified = req.query.verified as string | undefined;
      const page = parseInt(req.query.page as string || '1');
      const pageSize = parseInt(req.query.pageSize as string || '50');
      const sortBy = (req.query.sortBy as string) || 'monthly_revenue';
      const sortOrder = (req.query.sortOrder as string) || 'desc';
      const offset = (page - 1) * pageSize;

      const isVerified = verified === undefined || verified === null ? true : verified === 'true';

      let countQuery = supabaseAdmin
        .from('competitor_stores')
        .select('id', { count: 'exact', head: true })
        .eq('verified', isVerified);

      let dataQuery = supabaseAdmin
        .from('competitor_stores')
        .select('*, categories(id, name, slug)', { count: 'exact' })
        .eq('verified', isVerified);

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

      const sortColumn = sortBy === 'name' ? 'name' :
                         sortBy === 'monthly_revenue' ? 'monthly_revenue' :
                         sortBy === 'monthly_traffic' ? 'monthly_traffic' :
                         sortBy === 'growth' ? 'growth' :
                         sortBy === 'rating' ? 'rating' :
                         'created_at';

      dataQuery = dataQuery
        .order(sortColumn, { ascending: sortOrder === 'asc', nullsFirst: false })
        .range(offset, offset + pageSize - 1);

      const [countResult, dataResult] = await Promise.all([countQuery, dataQuery]);

      const totalCount = countResult.count || 0;

      if (dataResult.error) {
        console.error('Error fetching competitor stores:', dataResult.error);
        return res.status(500).json({ error: 'Failed to fetch competitor stores' });
      }

      const stores = (dataResult.data || []).map((item: any) => {
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
      });

      return res.json({ stores, totalCount });
    } catch (error: any) {
      console.error('Unexpected error in GET competitor stores:', error);
      return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
  });

  // ==================== COURSE NOTES ====================

  // GET /api/course-notes
  app.get('/api/course-notes', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const moduleId = req.query.moduleId as string | undefined;

      if (!moduleId) {
        return res.status(400).json({ error: 'moduleId is required' });
      }

      const { data, error } = await supabaseAdmin
        .from('course_notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .order('timestamp_seconds', { ascending: true });

      if (error) {
        console.error('Error fetching course notes:', error);
        return res.status(500).json({ error: 'Failed to fetch notes' });
      }

      return res.json({ notes: data || [] });
    } catch (error) {
      console.error('Error in GET /api/course-notes:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/course-notes
  app.post('/api/course-notes', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { moduleId, text, timestamp_seconds } = req.body;

      if (!moduleId || !text) {
        return res.status(400).json({ error: 'moduleId and text are required' });
      }

      const { data, error } = await supabaseAdmin
        .from('course_notes')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          text,
          timestamp_seconds: timestamp_seconds || 0,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating course note:', error);
        return res.status(500).json({ error: 'Failed to create note' });
      }

      return res.status(201).json({ note: data });
    } catch (error) {
      console.error('Error in POST /api/course-notes:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/course-notes
  app.put('/api/course-notes', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id, text, timestamp_seconds } = req.body;

      if (!id || !text) {
        return res.status(400).json({ error: 'id and text are required' });
      }

      const { data, error } = await supabaseAdmin
        .from('course_notes')
        .update({ text, timestamp_seconds: timestamp_seconds || 0, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating course note:', error);
        return res.status(500).json({ error: 'Failed to update note' });
      }

      return res.json({ note: data });
    } catch (error) {
      console.error('Error in PUT /api/course-notes:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE /api/course-notes
  app.delete('/api/course-notes', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const id = req.query.id as string | undefined;

      if (!id) {
        return res.status(400).json({ error: 'id is required' });
      }

      const { error } = await supabaseAdmin
        .from('course_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting course note:', error);
        return res.status(500).json({ error: 'Failed to delete note' });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error('Error in DELETE /api/course-notes:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ==================== COURSES ====================

  // GET /api/courses
  app.get('/api/courses', async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const level = req.query.level as string | undefined;
      const search = req.query.search as string | undefined;
      const featured = req.query.featured as string | undefined;
      const published = (req.query.published as string) ?? 'true';
      const sortBy = (req.query.sortBy as string) || 'created_at';
      const sortOrder = (req.query.sortOrder as string) || 'desc';
      const page = parseInt(req.query.page as string || '1');
      const pageSize = parseInt(req.query.pageSize as string || '20');

      let query = supabaseAdmin
        .from('courses')
        .select('*')
        .eq('is_onboarding', false);

      if (published === 'true') {
        query = query.eq('published', true);
      }
      if (category) query = query.eq('category', category);
      if (level) query = query.eq('level', level);
      if (featured === 'true') query = query.eq('featured', true);
      if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`);

      let countQuery = supabaseAdmin
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_onboarding', false);

      if (published === 'true') countQuery = countQuery.eq('published', true);
      if (category) countQuery = countQuery.eq('category', category);
      if (level) countQuery = countQuery.eq('level', level);
      if (featured === 'true') countQuery = countQuery.eq('featured', true);
      if (search) countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`);

      const { count } = await countQuery;
      const total = count || 0;

      const ascending = sortOrder === 'asc';
      query = query.order(sortBy, { ascending, nullsFirst: false });

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching courses:', error);
        return res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
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
          is_onboarding: course.is_onboarding ?? false,
          instructor_name: instructor?.full_name || undefined,
          instructor_avatar: instructor?.avatar_url || undefined,
        };
      });

      const totalPages = Math.ceil(total / pageSize);

      return res.json({ courses, total, page, pageSize, totalPages });
    } catch (error) {
      console.error('Unexpected error fetching courses:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/courses/:id
  app.get('/api/courses/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data: courseData, error: courseError } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError || !courseData) {
        return res.status(404).json({ error: 'Course not found' });
      }

      let instructorProfile: { full_name: string | null; avatar_url: string | null } | null = null;
      if (courseData.instructor_id) {
        const { data: profileData } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', courseData.instructor_id)
          .single();

        if (profileData) {
          instructorProfile = { full_name: profileData.full_name, avatar_url: profileData.avatar_url };
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

  // POST /api/courses/:id/chapters/:chapterId/quiz
  app.post('/api/courses/:id/chapters/:chapterId/quiz', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id: courseId, chapterId } = req.params;
      const body = req.body;

      const { data: enrollment, error: enrollmentError } = await supabaseAdmin
        .from('course_enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();

      if (enrollmentError || !enrollment) {
        return res.status(404).json({ error: 'Not enrolled in this course' });
      }

      const { data: chapter, error: chapterError } = await supabaseAdmin
        .from('course_chapters')
        .select('*')
        .eq('id', chapterId)
        .single();

      if (chapterError || !chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }

      if (chapter.content_type !== 'quiz') {
        return res.status(400).json({ error: 'Chapter is not a quiz' });
      }

      const content = chapter.content as any;
      const questions: any[] = content.quiz_questions || [];

      if (questions.length === 0) {
        return res.status(400).json({ error: 'Quiz has no questions' });
      }

      const { score, passed, feedback } = calculateQuizScore(questions, body.answers);

      const { data: attempt, error: attemptError } = await supabaseAdmin
        .from('quiz_attempts')
        .insert({
          enrollment_id: enrollment.id,
          chapter_id: chapterId,
          answers: body.answers,
          score: score,
          passed: passed,
          attempted_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (attemptError) {
        console.error('Error saving quiz attempt:', attemptError);
        return res.status(500).json({ error: 'Failed to save quiz attempt', details: attemptError.message });
      }

      return res.status(201).json({
        attempt: {
          id: attempt.id,
          enrollment_id: attempt.enrollment_id,
          chapter_id: attempt.chapter_id,
          answers: attempt.answers,
          score: parseFloat(attempt.score || '0'),
          passed: attempt.passed,
          attempted_at: attempt.attempted_at,
          completed_at: attempt.completed_at,
        },
        score,
        passed,
        feedback,
      });
    } catch (error) {
      console.error('Unexpected error submitting quiz:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/courses/:id/chapters/:chapterId/video
  app.get('/api/courses/:id/chapters/:chapterId/video', optionalAuth, async (req: Request, res: Response) => {
    try {
      const { id: courseId, chapterId } = req.params;
      const userId = req.user?.id || null;

      const { data: chapter, error: chapterError } = await supabaseAdmin
        .from('course_chapters')
        .select(`
          id,
          module_id,
          content,
          course_modules!inner(
            id,
            course_id,
            courses!inner(
              id,
              instructor_id,
              published
            )
          )
        `)
        .eq('id', chapterId)
        .single();

      if (chapterError || !chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }

      const course = (chapter.course_modules as any).courses;

      if (course.id !== courseId) {
        return res.status(400).json({ error: 'Course ID mismatch' });
      }

      let hasAccess = false;

      if (userId) {
        const { data: enrollment } = await supabaseAdmin
          .from('course_enrollments')
          .select('id')
          .eq('course_id', courseId)
          .eq('user_id', userId)
          .single();

        if (enrollment) hasAccess = true;
        if (course.instructor_id === userId) hasAccess = true;

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('internal_role')
          .eq('id', userId)
          .single();

        if (profile?.internal_role === 'superadmin' || profile?.internal_role === 'admin') {
          hasAccess = true;
        }
      }

      const { data: chapterData } = await supabaseAdmin
        .from('course_chapters')
        .select('is_preview')
        .eq('id', chapterId)
        .single();

      if (chapterData?.is_preview && course.published) {
        hasAccess = true;
      }

      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied. Please enroll in the course to view this video.' });
      }

      const chapterContent = chapter.content as any;
      const videoStoragePath = chapterContent?.video_storage_path || chapterContent?.video_url;

      if (!videoStoragePath) {
        return res.status(404).json({ error: 'Video not found for this chapter' });
      }

      let storagePath = videoStoragePath;
      if (videoStoragePath.startsWith('http')) {
        const urlParts = new URL(videoStoragePath);
        storagePath = urlParts.pathname.replace('/storage/v1/object/public/course-videos/', '');
      }

      const expiresIn = 3600;
      const { data: signedData, error: signedError } = await supabaseAdmin.storage
        .from('course-videos')
        .createSignedUrl(storagePath, expiresIn);

      if (signedError) {
        throw new Error(`Failed to generate signed URL: ${signedError.message}`);
      }

      return res.json({
        url: signedData.signedUrl,
        expiresIn,
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      });
    } catch (error) {
      console.error('Error getting video URL:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get video URL' });
    }
  });

  // POST /api/courses/:id/enroll
  app.post('/api/courses/:id/enroll', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id: courseId } = req.params;

      const { data: course, error: courseError } = await supabaseAdmin
        .from('courses')
        .select('id, published')
        .eq('id', courseId)
        .single();

      if (courseError || !course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (!course.published) {
        return res.status(403).json({ error: 'Course is not published' });
      }

      const { data: existingEnrollment } = await supabaseAdmin
        .from('course_enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();

      if (existingEnrollment) {
        return res.status(400).json({ error: 'Already enrolled in this course' });
      }

      const { data: enrollment, error: enrollmentError } = await supabaseAdmin
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          user_id: user.id,
          enrolled_at: new Date().toISOString(),
          progress_percentage: 0,
        })
        .select()
        .single();

      if (enrollmentError) {
        console.error('Error creating enrollment:', enrollmentError);
        return res.status(500).json({ error: 'Failed to enroll in course', details: enrollmentError.message });
      }

      return res.status(201).json({
        enrollment: {
          id: enrollment.id,
          course_id: enrollment.course_id,
          user_id: enrollment.user_id,
          enrolled_at: enrollment.enrolled_at,
          completed_at: enrollment.completed_at,
          progress_percentage: parseFloat(enrollment.progress_percentage || '0'),
          last_accessed_at: enrollment.last_accessed_at,
          last_accessed_chapter_id: enrollment.last_accessed_chapter_id,
        },
      });
    } catch (error) {
      console.error('Unexpected error enrolling in course:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/courses/:id/modules/:moduleId/chapters/:chapterId/video-url
  app.get('/api/courses/:id/modules/:moduleId/chapters/:chapterId/video-url', async (req: Request, res: Response) => {
    try {
      const videoPath = req.query.path as string | undefined;

      if (!videoPath) {
        return res.status(400).json({ error: 'Path parameter is required' });
      }

      const { data, error } = await supabaseAdmin.storage
        .from('course-videos')
        .createSignedUrl(videoPath, 3600);

      if (error) {
        throw new Error(`Failed to generate signed URL: ${error.message}`);
      }

      return res.json({ url: data.signedUrl });
    } catch (error) {
      console.error('Error generating video URL:', error);
      return res.status(500).json({ error: 'Failed to generate video URL' });
    }
  });

  // GET /api/courses/:id/progress
  app.get('/api/courses/:id/progress', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id: courseId } = req.params;

      const { data: enrollment, error: enrollmentError } = await supabaseAdmin
        .from('course_enrollments')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();

      if (enrollmentError || !enrollment) {
        return res.status(404).json({ error: 'Not enrolled in this course' });
      }

      const { data: completions } = await supabaseAdmin
        .from('chapter_completions')
        .select('chapter_id')
        .eq('enrollment_id', enrollment.id);

      const completed_chapters = completions?.map((c: { chapter_id: string }) => c.chapter_id) || [];

      const { data: modules } = await supabaseAdmin
        .from('course_modules')
        .select('id')
        .eq('course_id', courseId);

      const moduleIds = modules?.map((m: { id: string }) => m.id) || [];

      const { count: totalChapters } = await supabaseAdmin
        .from('course_chapters')
        .select('*', { count: 'exact', head: true })
        .in('module_id', moduleIds);

      let lastAccessedChapter = null;
      if (enrollment.last_accessed_chapter_id) {
        const { data: chapter } = await supabaseAdmin
          .from('course_chapters')
          .select('*')
          .eq('id', enrollment.last_accessed_chapter_id)
          .single();

        if (chapter) {
          lastAccessedChapter = {
            id: chapter.id,
            module_id: chapter.module_id,
            title: chapter.title,
            description: chapter.description,
            content_type: chapter.content_type,
            content: chapter.content,
            order_index: chapter.order_index,
            duration_minutes: chapter.duration_minutes,
            is_preview: chapter.is_preview || false,
            created_at: chapter.created_at,
            updated_at: chapter.updated_at,
          };
        }
      }

      return res.json({
        enrollment: {
          id: enrollment.id,
          course_id: enrollment.course_id,
          user_id: enrollment.user_id,
          enrolled_at: enrollment.enrolled_at,
          completed_at: enrollment.completed_at,
          progress_percentage: parseFloat(enrollment.progress_percentage || '0'),
          last_accessed_at: enrollment.last_accessed_at,
          last_accessed_chapter_id: enrollment.last_accessed_chapter_id,
        },
        completed_chapters,
        total_chapters: totalChapters || 0,
        progress_percentage: parseFloat(enrollment.progress_percentage || '0'),
        last_accessed_chapter: lastAccessedChapter || undefined,
      });
    } catch (error) {
      console.error('Unexpected error fetching progress:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/courses/:id/progress/chapters/:chapterId/complete
  app.post('/api/courses/:id/progress/chapters/:chapterId/complete', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id: courseId, chapterId } = req.params;
      const { time_spent_minutes } = req.body || {};

      const { data: enrollment, error: enrollmentError } = await supabaseAdmin
        .from('course_enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();

      if (enrollmentError || !enrollment) {
        return res.status(404).json({ error: 'Not enrolled in this course' });
      }

      const { data: chapter } = await supabaseAdmin
        .from('course_chapters')
        .select('id, module_id')
        .eq('id', chapterId)
        .single();

      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }

      const { data: module } = await supabaseAdmin
        .from('course_modules')
        .select('course_id')
        .eq('id', chapter.module_id)
        .single();

      if (!module || module.course_id !== courseId) {
        return res.status(400).json({ error: 'Chapter does not belong to this course' });
      }

      const { data: existing } = await supabaseAdmin
        .from('chapter_completions')
        .select('id')
        .eq('enrollment_id', enrollment.id)
        .eq('chapter_id', chapterId)
        .single();

      if (existing) {
        const { data: completion, error: updateError } = await supabaseAdmin
          .from('chapter_completions')
          .update({
            completed_at: new Date().toISOString(),
            time_spent_minutes: time_spent_minutes || null,
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (updateError) {
          return res.status(500).json({ error: 'Failed to update completion', details: updateError.message });
        }

        return res.json({
          completion: {
            id: completion.id,
            enrollment_id: completion.enrollment_id,
            chapter_id: completion.chapter_id,
            completed_at: completion.completed_at,
            time_spent_minutes: completion.time_spent_minutes,
          },
        });
      }

      const { data: completion, error: completionError } = await supabaseAdmin
        .from('chapter_completions')
        .insert({
          enrollment_id: enrollment.id,
          chapter_id: chapterId,
          completed_at: new Date().toISOString(),
          time_spent_minutes: time_spent_minutes || null,
        })
        .select()
        .single();

      if (completionError) {
        console.error('Error creating completion:', completionError);
        return res.status(500).json({ error: 'Failed to mark chapter complete', details: completionError.message });
      }

      return res.status(201).json({
        completion: {
          id: completion.id,
          enrollment_id: completion.enrollment_id,
          chapter_id: completion.chapter_id,
          completed_at: completion.completed_at,
          time_spent_minutes: completion.time_spent_minutes,
        },
      });
    } catch (error) {
      console.error('Unexpected error completing chapter:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ==================== DASHBOARD ====================

  // GET /api/dashboard/stats
  app.get('/api/dashboard/stats', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const [
        productsResult,
        storesResult,
        activeStoresResult,
        onboardingResult,
        picklistResult,
        winningProductsResult
      ] = await Promise.allSettled([
        supabaseAdmin
          .from('products')
          .select('*', { count: 'exact', head: true }),

        supabaseAdmin
          .from('shopify_stores')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),

        supabaseAdmin
          .from('shopify_stores')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'active'),

        (async () => {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('onboarding_completed, onboarding_completed_at, onboarding_progress')
            .eq('id', user.id)
            .single();

          const { count: totalVideos } = await supabaseAdmin
            .from('onboarding_videos')
            .select('*', { count: 'exact', head: true })
            .then(r => r.count !== null ? r : { count: 0 });

          const { count: totalModules } = await supabaseAdmin
            .from('onboarding_modules')
            .select('*', { count: 'exact', head: true })
            .then(r => r.count !== null ? r : { count: 0 });

          const { count: completedVideos } = await supabaseAdmin
            .from('onboarding_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('completed', true)
            .then(r => r.count !== null ? r : { count: 0 });

          return {
            onboarding_completed: profile?.onboarding_completed || false,
            onboarding_progress: profile?.onboarding_progress || 0,
            completed_videos: completedVideos || 0,
            total_videos: totalVideos || 0,
            total_modules: totalModules || 0
          };
        })(),

        supabaseAdmin
          .from('user_picklist')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),

        supabaseAdmin
          .from('product_metadata')
          .select('product_id', { count: 'exact', head: true })
          .eq('is_winning', true)
      ]);

      const productsCount = productsResult.status === 'fulfilled' ? (productsResult.value.count || 0) : 0;
      const storesCount = storesResult.status === 'fulfilled' ? (storesResult.value.count || 0) : 0;
      const activeStoresCount = activeStoresResult.status === 'fulfilled' ? (activeStoresResult.value.count || 0) : 0;
      const onboardingData = onboardingResult.status === 'fulfilled'
        ? onboardingResult.value
        : { onboarding_progress: 0, completed_videos: 0, total_videos: 0, total_modules: 0 };
      const picklistCount = picklistResult.status === 'fulfilled' ? (picklistResult.value?.count || 0) : 0;
      const winningProductsCount = winningProductsResult.status === 'fulfilled' ? (winningProductsResult.value?.count || 0) : 0;

      const stats = {
        products: { total: productsCount, inPicklist: picklistCount, winning: winningProductsCount },
        stores: { total: storesCount, connected: storesCount, active: activeStoresCount },
        learning: {
          progress: onboardingData.onboarding_progress || 0,
          completedVideos: onboardingData.completed_videos || 0,
          totalVideos: onboardingData.total_videos || 0,
          enrolledCourses: 0
        },
        activity: { lastActivityDate: null, streakDays: 0 }
      };

      return res.json(stats);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ==================== DEV TASKS ====================

  // GET /api/dev/tasks
  app.get('/api/dev/tasks', requireAuth, async (req: Request, res: Response) => {
    try {
      const filters: any = {};

      if (req.query.status) filters.status = (req.query.status as string).split(',');
      if (req.query.priority) filters.priority = (req.query.priority as string).split(',');
      if (req.query.assigned_to) filters.assigned_to = (req.query.assigned_to as string).split(',');
      if (req.query.created_by) filters.created_by = (req.query.created_by as string).split(',');
      if (req.query.search) filters.search = req.query.search as string;
      if (req.query.parent_task_id) {
        const parentId = req.query.parent_task_id as string;
        filters.parent_task_id = parentId === 'null' ? null : parentId;
      }
      if (req.query.project_id) filters.project_id = req.query.project_id as string;

      let query = supabaseAdmin.from('dev_tasks').select('*');

      if (filters.status?.length > 0) query = query.in('status', filters.status);
      if (filters.priority?.length > 0) query = query.in('priority', filters.priority);
      if (filters.assigned_to?.length > 0) query = query.in('assigned_to', filters.assigned_to);
      if (filters.created_by?.length > 0) query = query.in('created_by', filters.created_by);
      if (filters.parent_task_id !== undefined) {
        if (filters.parent_task_id === null) {
          query = query.is('parent_task_id', null);
        } else {
          query = query.eq('parent_task_id', filters.parent_task_id);
        }
      }
      if (filters.project_id) query = query.eq('project_id', filters.project_id);
      if (filters.search) query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ error: 'Failed to fetch tasks' });
      }

      const tasks = (data || []) as any[];

      if (tasks.length > 0) {
        const assignedToIds = Array.from(new Set(tasks.map(t => t.assigned_to).filter(Boolean)));
        const createdByIds = Array.from(new Set(tasks.map(t => t.created_by).filter(Boolean)));
        const allUserIds = Array.from(new Set([...assignedToIds, ...createdByIds]));

        if (allUserIds.length > 0) {
          const { data: users } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, email, avatar_url, username')
            .in('id', allUserIds as string[]);

          const userMap = new Map((users || []).map((u: any) => [u.id, u]));

          tasks.forEach((task: any) => {
            if (task.assigned_to && userMap.has(task.assigned_to)) {
              task.assigned_user = userMap.get(task.assigned_to);
            }
            if (task.created_by && userMap.has(task.created_by)) {
              task.created_user = userMap.get(task.created_by);
            }
          });
        }
      }

      const parentTasks = tasks.filter(task => !task.parent_task_id);
      const subtasksMap = new Map<string, any[]>();

      tasks.forEach(task => {
        if (task.parent_task_id) {
          if (!subtasksMap.has(task.parent_task_id)) {
            subtasksMap.set(task.parent_task_id, []);
          }
          subtasksMap.get(task.parent_task_id)!.push(task);
        }
      });

      const result = parentTasks.map(task => ({
        ...task,
        subtasks: subtasksMap.get(task.id) || []
      }));

      return res.json(result);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  // POST /api/dev/tasks
  app.post('/api/dev/tasks', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const taskData = req.body;

      const { data, error } = await supabaseAdmin
        .from('dev_tasks')
        .insert({
          ...taskData,
          created_by: user.id,
          doc_links: taskData.doc_links || [],
          related_files: taskData.related_files || [],
          metadata: taskData.metadata || {}
        })
        .select(`
          *,
          assigned_user:profiles!dev_tasks_assigned_to_fkey(id, full_name, email, avatar_url, username),
          created_user:profiles!dev_tasks_created_by_fkey(id, full_name, email, avatar_url, username)
        `)
        .single();

      if (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ error: 'Failed to create task' });
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({ error: 'Failed to create task' });
    }
  });

  // GET /api/dev/tasks/recent
  app.get('/api/dev/tasks/recent', requireAuth, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string || '10');

      const { data, error } = await supabaseAdmin
        .from('dev_tasks')
        .select('*')
        .is('parent_task_id', null)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent tasks:', error);
        return res.status(500).json({ error: 'Failed to fetch recent tasks' });
      }

      return res.json(data || []);
    } catch (error) {
      console.error('Error fetching recent tasks:', error);
      return res.status(500).json({ error: 'Failed to fetch recent tasks' });
    }
  });

  // GET /api/dev/tasks/stats
  app.get('/api/dev/tasks/stats', requireAuth, async (req: Request, res: Response) => {
    try {
      const { data: tasks, error } = await supabaseAdmin
        .from('dev_tasks')
        .select('status, priority')
        .is('parent_task_id', null);

      if (error) {
        console.error('Error fetching task stats:', error);
        return res.status(500).json({ error: 'Failed to fetch task stats' });
      }

      const stats = {
        total: tasks?.length || 0,
        notStarted: 0,
        inProgress: 0,
        inReview: 0,
        completed: 0,
        blocked: 0,
        byPriority: { low: 0, medium: 0, high: 0, urgent: 0 }
      };

      tasks?.forEach((task: { status: string; priority: string }) => {
        switch (task.status) {
          case 'not-started': stats.notStarted++; break;
          case 'in-progress': stats.inProgress++; break;
          case 'in-review': stats.inReview++; break;
          case 'completed': stats.completed++; break;
          case 'blocked': stats.blocked++; break;
        }
        if (task.priority in stats.byPriority) {
          stats.byPriority[task.priority as keyof typeof stats.byPriority]++;
        }
      });

      return res.json(stats);
    } catch (error) {
      console.error('Error fetching task stats:', error);
      return res.status(500).json({ error: 'Failed to fetch task stats' });
    }
  });

  // GET /api/dev/tasks/:id
  app.get('/api/dev/tasks/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('dev_tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Task not found' });
        }
        console.error('Error fetching task:', error);
        return res.status(500).json({ error: 'Failed to fetch task' });
      }

      const task = data as any;

      if (task.assigned_to || task.created_by) {
        const userIds = [task.assigned_to, task.created_by].filter(Boolean) as string[];
        const { data: users } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, email, avatar_url, username')
          .in('id', userIds);

        const userMap = new Map((users || []).map((u: any) => [u.id, u]));
        if (task.assigned_to) task.assigned_user = userMap.get(task.assigned_to);
        if (task.created_by) task.created_user = userMap.get(task.created_by);
      }

      const { data: subtasks } = await supabaseAdmin
        .from('dev_tasks')
        .select('*')
        .eq('parent_task_id', id)
        .order('created_at', { ascending: false });

      task.subtasks = subtasks || [];

      return res.json(task);
    } catch (error) {
      console.error('Error fetching task:', error);
      return res.status(500).json({ error: 'Failed to fetch task' });
    }
  });

  // PUT /api/dev/tasks/:id
  app.put('/api/dev/tasks/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.user!;
      const taskData = req.body;

      const updateData: Record<string, any> = { ...taskData };
      if (taskData.doc_links !== undefined) updateData.doc_links = taskData.doc_links;
      if (taskData.related_files !== undefined) updateData.related_files = taskData.related_files;
      if (taskData.metadata !== undefined) updateData.metadata = taskData.metadata;

      const { data, error } = await supabaseAdmin
        .from('dev_tasks')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          assigned_user:profiles!dev_tasks_assigned_to_fkey(id, full_name, email, avatar_url, username),
          created_user:profiles!dev_tasks_created_by_fkey(id, full_name, email, avatar_url, username)
        `)
        .single();

      if (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ error: 'Failed to update task' });
      }

      return res.json(data);
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({ error: 'Failed to update task' });
    }
  });

  // DELETE /api/dev/tasks/:id
  app.delete('/api/dev/tasks/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseAdmin
        .from('dev_tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ error: 'Failed to delete task' });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  // GET /api/dev/tasks/:id/attachments
  app.get('/api/dev/tasks/:id/attachments', requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('dev_task_attachments')
        .select('*, profiles!dev_task_attachments_uploaded_by_fkey(id, full_name, email, avatar_url, username)')
        .eq('task_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching attachments:', error);
        return res.status(500).json({ error: 'Failed to fetch attachments' });
      }

      const attachments = (data || []).map((a: any) => ({
        ...a,
        uploader: a.profiles || null,
        profiles: undefined,
      }));

      return res.json(attachments);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      return res.status(500).json({ error: 'Failed to fetch attachments' });
    }
  });

  // POST /api/dev/tasks/:id/attachments
  app.post('/api/dev/tasks/:id/attachments', requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      const contentType = req.headers['content-type'] || '';
      if (!contentType.includes('multipart/form-data')) {
        return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
      }

      const multer = require('multer');
      const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

      return new Promise<void>((resolve) => {
        upload.single('file')(req, res, async (err: any) => {
          if (err) {
            res.status(400).json({ error: err.message });
            return resolve();
          }

          const file = (req as any).file;
          if (!file) {
            res.status(400).json({ error: 'No file provided' });
            return resolve();
          }

          try {
            const fileExt = file.originalname.split('.').pop();
            const uniqueFileName = `${id}/${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `tasks/${uniqueFileName}`;

            const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
              .from('dev-task-attachments')
              .upload(filePath, file.buffer, { contentType: file.mimetype });

            if (uploadError) {
              res.status(500).json({ error: 'Failed to upload file' });
              return resolve();
            }

            const { data: urlData } = supabaseAdmin.storage
              .from('dev-task-attachments')
              .getPublicUrl(filePath);

            const { data: attachment, error: attachmentError } = await supabaseAdmin
              .from('dev_task_attachments')
              .insert({
                task_id: id,
                file_name: file.originalname,
                file_path: filePath,
                file_size: file.size,
                file_type: file.mimetype,
                uploaded_by: user.id,
              })
              .select()
              .single();

            if (attachmentError) {
              res.status(500).json({ error: 'Failed to create attachment record' });
              return resolve();
            }

            res.status(201).json(attachment);
            resolve();
          } catch (error) {
            console.error('Error uploading attachment:', error);
            res.status(500).json({ error: 'Failed to upload attachment' });
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Error uploading attachment:', error);
      return res.status(500).json({ error: 'Failed to upload attachment' });
    }
  });

  // DELETE /api/dev/tasks/:id/attachments/:attachmentId
  app.delete('/api/dev/tasks/:id/attachments/:attachmentId', requireAuth, async (req: Request, res: Response) => {
    try {
      const { attachmentId } = req.params;

      const { data: attachment } = await supabaseAdmin
        .from('dev_task_attachments')
        .select('file_path')
        .eq('id', attachmentId)
        .single();

      if (attachment?.file_path) {
        await supabaseAdmin.storage
          .from('dev-task-attachments')
          .remove([attachment.file_path]);
      }

      const { error } = await supabaseAdmin
        .from('dev_task_attachments')
        .delete()
        .eq('id', attachmentId);

      if (error) {
        console.error('Error deleting attachment:', error);
        return res.status(500).json({ error: 'Failed to delete attachment' });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting attachment:', error);
      return res.status(500).json({ error: 'Failed to delete attachment' });
    }
  });

  // GET /api/dev/tasks/:id/comments
  app.get('/api/dev/tasks/:id/comments', requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('dev_task_comments')
        .select('*, profiles!dev_task_comments_user_id_fkey(id, full_name, email, avatar_url, username)')
        .eq('task_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ error: 'Failed to fetch comments' });
      }

      const comments = (data || []).map((c: any) => ({
        ...c,
        user: c.profiles || null,
        profiles: undefined,
      }));

      return res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  });

  // POST /api/dev/tasks/:id/comments
  app.post('/api/dev/tasks/:id/comments', requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.user!;
      const { comment_text } = req.body;

      const { data, error } = await supabaseAdmin
        .from('dev_task_comments')
        .insert({
          task_id: id,
          user_id: user.id,
          comment_text,
          is_system_log: false
        })
        .select(`
          *,
          user:profiles!dev_task_comments_user_id_fkey(id, full_name, email, avatar_url, username)
        `)
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ error: 'Failed to add comment' });
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error('Error adding comment:', error);
      return res.status(500).json({ error: 'Failed to add comment' });
    }
  });

  // GET /api/dev/tasks/:id/history
  app.get('/api/dev/tasks/:id/history', requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('dev_task_history')
        .select('*, profiles!dev_task_history_changed_by_fkey(id, full_name, email, avatar_url, username)')
        .eq('task_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        return res.status(500).json({ error: 'Failed to fetch history' });
      }

      const history = (data || []).map((h: any) => ({
        ...h,
        changed_user: h.profiles || null,
        profiles: undefined,
      }));

      return res.json(history);
    } catch (error) {
      console.error('Error fetching history:', error);
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
  });

  // ==================== LEARNING ====================

  // GET /api/learning/modules
  app.get('/api/learning/modules', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const PREVIEW_VIDEO_COUNT = 5;

      const isPro =
        user.account_type === 'pro' ||
        ['admin', 'super_admin', 'editor', 'moderator'].includes(user.internal_role || '');

      const { data: modules } = await supabaseAdmin
        .from('onboarding_modules')
        .select('id, title, description, order_index, thumbnail')
        .order('order_index');

      const { data: videos } = await supabaseAdmin
        .from('onboarding_videos')
        .select('id, title, description, video_url, video_duration, order_index, thumbnail, module_id')
        .order('order_index');

      const { data: progress } = await supabaseAdmin
        .from('onboarding_progress')
        .select('video_id, completed, completed_at')
        .eq('user_id', user.id);

      const progressMap = new Map(
        (progress || []).map((p: any) => [p.video_id, { completed: p.completed, completed_at: p.completed_at }])
      );

      const videosByModule = new Map<string, any[]>();
      (videos || []).forEach((v: any) => {
        if (!videosByModule.has(v.module_id)) {
          videosByModule.set(v.module_id, []);
        }
        videosByModule.get(v.module_id)!.push(v);
      });

      let globalVideoIndex = 0;
      const enrichedModules = (modules || []).map((mod: any) => {
        const moduleVideos = (videosByModule.get(mod.id) || [])
          .map((video: any) => {
            globalVideoIndex++;
            const isPreview = globalVideoIndex <= PREVIEW_VIDEO_COUNT;
            const isAccessible = isPro || isPreview;
            const prog = progressMap.get(video.id);

            return {
              ...video,
              module_id: undefined,
              globalIndex: globalVideoIndex,
              isPreview,
              isAccessible,
              completed: prog?.completed || false,
              completedAt: prog?.completed_at || null,
            };
          });

        const completedInModule = moduleVideos.filter((v: any) => v.completed).length;
        const totalInModule = moduleVideos.length;

        return {
          id: mod.id,
          title: mod.title,
          description: mod.description,
          order_index: mod.order_index,
          thumbnail: mod.thumbnail,
          videos: moduleVideos,
          completedCount: completedInModule,
          totalCount: totalInModule,
          isFullyCompleted: totalInModule > 0 && completedInModule === totalInModule,
        };
      });

      const totalVideos = globalVideoIndex;
      const totalCompleted = enrichedModules.reduce((sum: number, m: any) => sum + m.completedCount, 0);

      return res.json({
        modules: enrichedModules,
        isPro,
        previewCount: PREVIEW_VIDEO_COUNT,
        totalVideos,
        totalCompleted,
        progressPercentage: totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0,
      });
    } catch (error: any) {
      console.error('Error fetching learning modules:', error);
      return res.status(500).json({ error: 'Failed to fetch modules', details: error.message });
    }
  });

  // GET /api/learning/progress
  app.get('/api/learning/progress', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const { data: progress } = await supabaseAdmin
        .from('onboarding_progress')
        .select('video_id, completed, completed_at')
        .eq('user_id', user.id);

      const { count: totalCount } = await supabaseAdmin
        .from('onboarding_videos')
        .select('*', { count: 'exact', head: true });

      const completedCount = (progress || []).filter((p: any) => p.completed).length;
      const total = totalCount || 0;

      return res.json({
        progress: progress || [],
        completedCount,
        totalCount: total,
        percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
      });
    } catch (error: any) {
      console.error('Error fetching learning progress:', error);
      return res.status(500).json({ error: 'Failed to fetch progress', details: error.message });
    }
  });

  // POST /api/learning/progress
  app.post('/api/learning/progress', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { videoId, completed } = req.body;

      if (!videoId) {
        return res.status(400).json({ error: 'videoId is required' });
      }

      const { data: video } = await supabaseAdmin
        .from('onboarding_videos')
        .select('id')
        .eq('id', videoId)
        .single();

      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      const completedAt = completed !== false ? new Date().toISOString() : null;
      const isCompleted = completed !== false;

      const { error } = await supabaseAdmin
        .from('onboarding_progress')
        .upsert({
          user_id: user.id,
          video_id: videoId,
          completed: isCompleted,
          completed_at: completedAt,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,video_id' });

      if (error) {
        console.error('Error upserting progress:', error);
        return res.status(500).json({ error: 'Failed to update progress' });
      }

      return res.json({ success: true, videoId, completed: isCompleted });
    } catch (error: any) {
      console.error('Error updating learning progress:', error);
      return res.status(500).json({ error: 'Failed to update progress', details: error.message });
    }
  });

  // ==================== ONBOARDING ====================

  // POST /api/onboarding/complete
  app.post('/api/onboarding/complete', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { video_id, watch_duration } = req.body;

      if (!video_id) {
        return res.status(400).json({ error: 'video_id is required' });
      }

      const { data: video, error: videoError } = await supabaseAdmin
        .from('onboarding_videos')
        .select('id, module_id')
        .eq('id', video_id)
        .single();

      if (videoError || !video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      const { data: existingProgress } = await supabaseAdmin
        .from('onboarding_progress')
        .select('id, completed')
        .eq('user_id', user.id)
        .eq('video_id', video_id)
        .single();

      const progressData = {
        user_id: user.id,
        video_id,
        module_id: video.module_id,
        completed: true,
        completed_at: new Date().toISOString(),
        watch_duration: watch_duration || 0,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (existingProgress) {
        const { data, error } = await supabaseAdmin
          .from('onboarding_progress')
          .update(progressData)
          .eq('id', existingProgress.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating progress:', error);
          return res.status(500).json({ error: 'Failed to mark video as complete' });
        }
        result = data;
      } else {
        const { data, error } = await supabaseAdmin
          .from('onboarding_progress')
          .insert({ ...progressData, created_at: new Date().toISOString() })
          .select()
          .single();

        if (error) {
          console.error('Error creating progress:', error);
          return res.status(500).json({ error: 'Failed to mark video as complete' });
        }
        result = data;
      }

      await updateUserProgressPercentage(user.id);

      return res.json(result);
    } catch (error) {
      console.error('Error completing video:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/onboarding/course
  app.get('/api/onboarding/course', async (_req: Request, res: Response) => {
    try {
      const { data: modules, error: modulesError } = await supabaseAdmin
        .from('course_modules')
        .select(`
          id, title, description, order_index, thumbnail,
          content_type, content, video_url, video_storage_path,
          video_source, video_duration, created_at, updated_at
        `)
        .eq('course_id', '00000000-0000-0000-0000-000000000001')
        .order('order_index', { ascending: true });

      if (modulesError) {
        console.error('Error fetching modules:', modulesError);
        if (modulesError.code === '42P01' || modulesError.message?.includes('does not exist')) {
          return res.json({ modules: [], total_videos: 0, total_modules: 0 });
        }
        return res.status(500).json({ error: 'Failed to fetch onboarding course', details: modulesError.message });
      }

      const transformedVideos = (modules || [])
        .filter((module: any) => module.video_url || module.video_storage_path)
        .map((module: any) => ({
          id: module.id,
          module_id: module.id,
          title: module.title,
          description: module.description,
          video_url: module.video_url,
          video_storage_path: module.video_storage_path,
          video_source: module.video_source || (module.video_url ? 'embed' : 'upload'),
          video_duration: module.video_duration,
          thumbnail: module.thumbnail,
          order_index: module.order_index,
          created_at: module.created_at,
          updated_at: module.updated_at,
        }));

      const videoModules = transformedVideos.map((video: any) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        order_index: video.order_index,
        thumbnail: video.thumbnail,
        created_at: video.created_at,
        updated_at: video.updated_at,
        videos: [video],
      }));

      return res.json({
        modules: videoModules,
        total_videos: transformedVideos.length,
        total_modules: videoModules.length,
      });
    } catch (error) {
      console.error('Error fetching onboarding course:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/onboarding/progress
  app.get('/api/onboarding/progress', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const { data: progress, error: progressError } = await supabaseAdmin
        .from('onboarding_progress')
        .select(`
          id, user_id, video_id, completed, completed_at,
          watch_time, created_at, updated_at,
          onboarding_videos (id, title, video_url, video_duration)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (progressError) {
        console.error('Error fetching progress:', progressError);
        return res.status(500).json({ error: 'Failed to fetch progress' });
      }

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('onboarding_completed, onboarding_completed_at, onboarding_progress')
        .eq('id', user.id)
        .single();

      const { count: totalVideos } = await supabaseAdmin
        .from('onboarding_videos')
        .select('*', { count: 'exact', head: true });

      const { count: totalModules } = await supabaseAdmin
        .from('onboarding_modules')
        .select('*', { count: 'exact', head: true });

      const completedVideos = progress?.filter((p: any) => p.completed).length || 0;

      const status = {
        onboarding_completed: profile?.onboarding_completed || false,
        onboarding_completed_at: profile?.onboarding_completed_at || null,
        onboarding_progress: profile?.onboarding_progress || 0,
        completed_videos: completedVideos,
        total_videos: totalVideos || 0,
        completed_modules: 0,
        total_modules: totalModules || 0,
      };

      return res.json({ progress: progress || [], status });
    } catch (error) {
      console.error('Error fetching onboarding progress:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/onboarding/progress
  app.post('/api/onboarding/progress', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { video_id, completed } = req.body;
      const watch_time = req.body.watch_duration || req.body.watch_time;

      if (!video_id) {
        return res.status(400).json({ error: 'video_id is required' });
      }

      const { data: video, error: videoError } = await supabaseAdmin
        .from('onboarding_videos')
        .select('id, module_id')
        .eq('id', video_id)
        .single();

      if (videoError || !video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      const { data: existingProgress } = await supabaseAdmin
        .from('onboarding_progress')
        .select('id, completed, watch_time')
        .eq('user_id', user.id)
        .eq('video_id', video_id)
        .single();

      const updateData: any = {
        user_id: user.id,
        video_id,
        updated_at: new Date().toISOString(),
      };

      if (watch_time !== undefined) {
        updateData.watch_time = Math.max(existingProgress?.watch_time || 0, watch_time);
      }

      if (completed !== undefined) {
        updateData.completed = completed;
        if (completed && !existingProgress?.completed) {
          updateData.completed_at = new Date().toISOString();
        }
      }

      let result;
      if (existingProgress) {
        const { data, error } = await supabaseAdmin
          .from('onboarding_progress')
          .update(updateData)
          .eq('id', existingProgress.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating progress:', error);
          return res.status(500).json({ error: 'Failed to update progress' });
        }
        result = data;
      } else {
        const { data, error } = await supabaseAdmin
          .from('onboarding_progress')
          .insert({ ...updateData, created_at: new Date().toISOString() })
          .select()
          .single();

        if (error) {
          console.error('Error creating progress:', error);
          return res.status(500).json({ error: 'Failed to create progress' });
        }
        result = data;
      }

      await updateUserProgressPercentage(user.id);

      return res.json(result);
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/onboarding/status
  app.get('/api/onboarding/status', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const [profileResult, totalVideosResult, totalModulesResult, completedVideosResult, allVideosResult, completedProgressResult] = await Promise.all([
        supabaseAdmin
          .from('profiles')
          .select('onboarding_completed, onboarding_completed_at, onboarding_progress')
          .eq('id', user.id)
          .single(),

        supabaseAdmin
          .from('onboarding_videos')
          .select('id', { count: 'exact', head: true }),

        supabaseAdmin
          .from('onboarding_modules')
          .select('id')
          .order('id'),

        supabaseAdmin
          .from('onboarding_progress')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('completed', true),

        supabaseAdmin
          .from('onboarding_videos')
          .select('id, module_id'),

        supabaseAdmin
          .from('onboarding_progress')
          .select('video_id')
          .eq('user_id', user.id)
          .eq('completed', true),
      ]);

      const profile = profileResult.data;
      const totalVideos = totalVideosResult.count || 0;
      const allModules = totalModulesResult.data || [];
      const completedVideos = completedVideosResult.count || 0;
      const allVideos = allVideosResult.data || [];
      const completedProgress = completedProgressResult.data || [];

      const completedVideoIds = new Set(completedProgress.map((p: any) => p.video_id));
      const videosByModule = new Map<string, string[]>();
      for (const video of allVideos) {
        const moduleVideos = videosByModule.get(video.module_id) || [];
        moduleVideos.push(video.id);
        videosByModule.set(video.module_id, moduleVideos);
      }

      let completedModules = 0;
      for (const module of allModules) {
        const moduleVideos = videosByModule.get(module.id) || [];
        if (moduleVideos.length > 0 && moduleVideos.every(vid => completedVideoIds.has(vid))) {
          completedModules++;
        }
      }

      return res.json({
        onboarding_completed: profile?.onboarding_completed || false,
        onboarding_completed_at: profile?.onboarding_completed_at || null,
        onboarding_progress: profile?.onboarding_progress || 0,
        completed_videos: completedVideos,
        total_videos: totalVideos,
        completed_modules: completedModules,
        total_modules: allModules.length,
      });
    } catch (error) {
      console.error('Onboarding status check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ==================== PICKLIST ====================

  // GET /api/picklist
  app.get('/api/picklist', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const { data: picklistItems, error } = await supabaseAdmin
        .from('user_picklist')
        .select('id, product_id, notes, created_at, products(id, title, image, buy_price, sell_price, profit_per_order, category_id, categories(id, name, slug))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching picklist:', error);
        return res.status(500).json({ error: 'Failed to fetch picklist' });
      }

      const transformedItems = (picklistItems || []).map((item: any) => {
        const p = item.products;
        const cat = p?.categories;
        return {
          id: item.id,
          productId: item.product_id,
          title: p?.title || 'Unknown Product',
          image: p?.image || '/demo-products/Screenshot 2024-07-24 185228.png',
          price: p?.sell_price || 0,
          buyPrice: p?.buy_price || 0,
          profitPerOrder: p?.profit_per_order || 0,
          category: cat?.name || cat?.slug || 'Uncategorized',
          addedDate: item.created_at,
          source: 'product-hunt',
        };
      });

      return res.json({ items: transformedItems });
    } catch (error) {
      console.error('Error in GET /api/picklist:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/picklist
  app.post('/api/picklist', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      const { data: product } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('id', productId)
        .single();

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const { data: result, error: insertError } = await supabaseAdmin
        .from('user_picklist')
        .insert({ user_id: user.id, product_id: productId })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          return res.status(409).json({ error: 'Product already in picklist', alreadyExists: true });
        }
        console.error('Error adding to picklist:', insertError);
        return res.status(500).json({ error: 'Failed to add product to picklist' });
      }

      return res.status(201).json({ message: 'Product added to picklist', item: result });
    } catch (error) {
      console.error('Error in POST /api/picklist:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE /api/picklist/:id
  app.delete('/api/picklist/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id } = req.params;

      await supabaseAdmin
        .from('user_picklist')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      return res.json({ message: 'Product removed from picklist' });
    } catch (error) {
      console.error('Error in DELETE /api/picklist/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ==================== PRODUCTS ====================

  // GET /api/products
  app.get('/api/products', async (req: Request, res: Response) => {
    try {
      const sourceType = req.query.source_type as string | undefined;
      const isWinning = req.query.is_winning as string | undefined;
      const isLocked = req.query.is_locked as string | undefined;
      const categoryId = req.query.category_id as string | undefined;
      const search = req.query.search as string | undefined;
      const page = parseInt(req.query.page as string || '1');
      const pageSize = parseInt(req.query.pageSize as string || '20');
      const sortBy = (req.query.sortBy as string) || 'created_at';
      const sortOrder = (req.query.sortOrder as string) || 'desc';
      const offset = (page - 1) * pageSize;

      const selectParts = ['*', 'categories(*)', 'suppliers(*)'];
      if (isWinning !== undefined || isLocked !== undefined) {
        selectParts.push('product_metadata!inner(*)');
      } else {
        selectParts.push('product_metadata(*)');
      }
      if (sourceType) {
        selectParts.push('product_source!inner(*)');
      } else {
        selectParts.push('product_source(*)');
      }

      let query = supabaseRemote
        .from('products')
        .select(selectParts.join(', '), { count: 'exact' });

      if (sourceType) query = query.eq('product_source.source_type', sourceType);
      if (isWinning !== undefined) query = query.eq('product_metadata.is_winning', isWinning === 'true');
      if (isLocked !== undefined) query = query.eq('product_metadata.is_locked', isLocked === 'true');
      if (categoryId) query = query.eq('category_id', categoryId);
      if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

      const sortColumn = sortBy === 'profit_per_order' ? 'profit_per_order' :
                         sortBy === 'sell_price' ? 'sell_price' :
                         sortBy === 'rating' ? 'rating' :
                         'created_at';
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: 'Failed to fetch products' });
      }

      const total = count || 0;

      const products = (data || []).map((row: any) => {
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
            id: cat.id, name: cat.name, slug: cat.slug, description: cat.description,
            image: cat.image, thumbnail: cat.thumbnail || null, parent_category_id: cat.parent_category_id,
            trending: cat.trending, product_count: cat.product_count, avg_profit_margin: cat.avg_profit_margin,
            growth_percentage: cat.growth_percentage, created_at: cat.created_at, updated_at: cat.updated_at,
          } : undefined,
          buy_price: parseFloat(row.buy_price),
          sell_price: parseFloat(row.sell_price),
          profit_per_order: parseFloat(row.profit_per_order),
          additional_images: Array.isArray(row.additional_images) ? row.additional_images : [],
          specifications: row.specifications || null,
          rating: row.rating ? parseFloat(row.rating) : null,
          reviews_count: row.reviews_count || 0,
          trend_data: Array.isArray(row.trend_data) ? row.trend_data : [],
          supplier_id: row.supplier_id,
          supplier: sup ? {
            id: sup.id, name: sup.name, company_name: sup.name || null, logo: null,
            website: sup.website, country: sup.country, rating: sup.rating, verified: sup.verified,
            shipping_time: sup.shipping_time, min_order_quantity: sup.min_order_quantity,
            contact_email: sup.contact_email, created_at: sup.created_at, updated_at: sup.updated_at,
          } : undefined,
          created_at: row.created_at,
          updated_at: row.updated_at,
          metadata: meta ? {
            id: meta.id, product_id: meta.product_id, is_winning: meta.is_winning || false,
            is_locked: meta.is_locked || false,
            unlock_price: meta.unlock_price ? parseFloat(meta.unlock_price) : null,
            profit_margin: meta.profit_margin ? parseFloat(meta.profit_margin) : null,
            pot_revenue: meta.pot_revenue ? parseFloat(meta.pot_revenue) : null,
            revenue_growth_rate: meta.revenue_growth_rate ? parseFloat(meta.revenue_growth_rate) : null,
            items_sold: meta.items_sold,
            avg_unit_price: meta.avg_unit_price ? parseFloat(meta.avg_unit_price) : null,
            revenue_trend: Array.isArray(meta.revenue_trend) ? meta.revenue_trend : [],
            found_date: meta.found_date, detailed_analysis: meta.detailed_analysis,
            filters: Array.isArray(meta.filters) ? meta.filters : [],
            created_at: meta.created_at, updated_at: meta.updated_at,
          } : undefined,
          source: src ? {
            id: src.id, product_id: src.product_id, source_type: src.source_type,
            source_id: src.source_id, standardized_at: src.standardized_at,
            standardized_by: src.standardized_by, created_at: src.created_at, updated_at: src.updated_at,
          } : undefined,
        };
      });

      const totalPages = Math.ceil(total / pageSize);

      return res.json({ products, total, page, pageSize, totalPages });
    } catch (error) {
      console.error('Unexpected error fetching products:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/products/:id
  app.get('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!id || !UUID_REGEX.test(id)) {
        return res.status(400).json({ error: 'Invalid product ID', details: 'Product ID is required and must be a valid UUID' });
      }

      const { data, error } = await supabaseRemote
        .from('products')
        .select('*, categories(*), suppliers(*), product_metadata(*), product_source(*)')
        .eq('id', id)
        .single();

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

  // PATCH /api/products/:id
  app.patch('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!id || !UUID_REGEX.test(id)) {
        return res.status(400).json({ error: 'Invalid product ID', details: 'Product ID is required and must be a valid UUID' });
      }

      const body = req.body;
      const { title, image, description, category_id, buy_price, sell_price, additional_images, specifications, rating, reviews_count, trend_data, supplier_id, metadata, source } = body;

      const updateFields: Record<string, any> = {};

      if (title !== undefined) updateFields.title = title;
      if (image !== undefined) updateFields.image = image;
      if (description !== undefined) updateFields.description = description;
      if (category_id !== undefined) updateFields.category_id = category_id;
      if (buy_price !== undefined) updateFields.buy_price = buy_price;
      if (sell_price !== undefined) updateFields.sell_price = sell_price;
      if (buy_price !== undefined || sell_price !== undefined) {
        const newBuy = buy_price !== undefined ? parseFloat(buy_price) : null;
        const newSell = sell_price !== undefined ? parseFloat(sell_price) : null;
        if (newBuy !== null && newSell !== null) {
          updateFields.profit_per_order = newSell - newBuy;
        }
      }
      if (additional_images !== undefined) updateFields.additional_images = additional_images;
      if (specifications !== undefined) updateFields.specifications = specifications || null;
      if (rating !== undefined) updateFields.rating = rating;
      if (reviews_count !== undefined) updateFields.reviews_count = reviews_count;
      if (trend_data !== undefined) updateFields.trend_data = trend_data;
      if (supplier_id !== undefined) updateFields.supplier_id = supplier_id;

      if (Object.keys(updateFields).length > 0) {
        updateFields.updated_at = new Date().toISOString();

        const { data: updateResult, error: updateError } = await supabaseRemote
          .from('products')
          .update(updateFields)
          .eq('id', id)
          .select();

        if (updateError || !updateResult?.length) {
          return res.status(500).json({ error: 'Failed to update product', details: 'Product not found or no rows updated' });
        }
      }

      if (metadata) {
        try {
          const metaUpdate: Record<string, any> = { product_id: id };
          const metaColumns = ['is_winning', 'is_locked', 'unlock_price', 'profit_margin', 'pot_revenue', 'revenue_growth_rate', 'items_sold', 'avg_unit_price', 'revenue_trend', 'found_date', 'detailed_analysis', 'filters'];

          for (const col of metaColumns) {
            if (metadata[col] !== undefined) metaUpdate[col] = metadata[col];
          }

          if (Object.keys(metaUpdate).length > 1) {
            metaUpdate.updated_at = new Date().toISOString();
            await supabaseRemote.from('product_metadata').upsert(metaUpdate, { onConflict: 'product_id' });
          }
        } catch (metaError) {
          console.error('Error updating product metadata:', metaError);
        }
      }

      if (source) {
        try {
          const srcUpdate: Record<string, any> = { product_id: id };
          const srcColumns = ['source_type', 'source_id', 'standardized_at', 'standardized_by'];

          for (const col of srcColumns) {
            if (source[col] !== undefined) srcUpdate[col] = source[col];
          }

          if (Object.keys(srcUpdate).length > 1) {
            srcUpdate.updated_at = new Date().toISOString();
            await supabaseRemote.from('product_source').upsert(srcUpdate, { onConflict: 'product_id' });
          }
        } catch (sourceError) {
          console.error('Error updating product source:', sourceError);
        }
      }

      const { data: completeResult, error: fetchError } = await supabaseRemote
        .from('products')
        .select('*, categories(*), suppliers(*), product_metadata(*), product_source(*)')
        .eq('id', id)
        .single();

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

  // DELETE /api/products/:id
  app.delete('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!id || !UUID_REGEX.test(id)) {
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

  // GET /api/products/:id/research
  app.get('/api/products/:id/research', async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!id || !UUID_REGEX.test(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }

      const { data, error } = await supabaseRemote
        .from('product_research')
        .select('*')
        .eq('product_id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.json({ research: null });
        }
        console.error('Error fetching research:', error);
        return res.status(500).json({ error: 'Failed to fetch research data' });
      }

      return res.json({ research: data });
    } catch (error) {
      console.error('Error in GET /api/products/[id]/research:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/products/:id/research
  app.post('/api/products/:id/research', async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!id || !UUID_REGEX.test(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }

      const { data: product, error: productError } = await supabaseRemote
        .from('products')
        .select(`id, title, description, buy_price, sell_price, category:categories(name, slug)`)
        .eq('id', id)
        .single();

      if (productError || !product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const { productResearchService } = await import('../../src/lib/services/product-research-service');

      const researchDataRaw = await productResearchService.researchProduct({
        title: product.title,
        description: product.description,
        buyPrice: product.buy_price,
        sellPrice: product.sell_price,
        category: (product.category as any)?.[0]?.name || (product.category as any)?.[0]?.slug || undefined,
      });

      const anyResearch = researchDataRaw as any;
      const categorySuggestion = anyResearch?.category_suggestion as
        | { slug?: string; name?: string; confidence?: number }
        | undefined;

      if (anyResearch && 'category_suggestion' in anyResearch) {
        delete anyResearch.category_suggestion;
      }

      const researchData = anyResearch;

      if (categorySuggestion && (categorySuggestion.slug || categorySuggestion.name)) {
        try {
          const slug = categorySuggestion.slug?.toLowerCase().trim();
          const name = categorySuggestion.name?.trim();

          let categoryQuery = supabaseRemote.from('categories').select('id, slug, name');

          if (slug) {
            categoryQuery = categoryQuery.ilike('slug', slug);
          } else if (name) {
            categoryQuery = categoryQuery.ilike('name', name);
          }

          const { data: matchedCategory, error: categoryError } = await categoryQuery.limit(1).maybeSingle();

          if (!categoryError && matchedCategory) {
            const { error: updateError } = await supabaseRemote
              .from('products')
              .update({ category_id: matchedCategory.id })
              .eq('id', id);

            if (updateError) {
              console.error('Error updating product category from research:', updateError);
            }
          } else if (categoryError) {
            console.error('Error looking up suggested category:', categoryError);
          }
        } catch (err) {
          console.error('Unexpected error applying category suggestion:', err);
        }
      }

      const { data: savedResearch, error: saveError } = await supabaseRemote
        .from('product_research')
        .upsert({
          product_id: id,
          ...researchData,
          research_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'product_id' })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving research:', saveError);
        return res.status(500).json({ error: 'Failed to save research data', details: saveError.message });
      }

      return res.status(201).json({ message: 'Research completed successfully', research: savedResearch });
    } catch (error) {
      console.error('Error in POST /api/products/[id]/research:', error);
      return res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
    }
  });

  // ==================== ROADMAP PROGRESS ====================

  // GET /api/roadmap-progress
  app.get('/api/roadmap-progress', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const { data, error } = await supabaseAdmin
        .from('roadmap_progress')
        .select('task_id, status')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching roadmap progress:', error);
        return res.status(500).json({ error: 'Failed to fetch progress' });
      }

      const statuses: Record<string, string> = {};
      for (const row of data || []) {
        statuses[row.task_id] = row.status;
      }

      return res.json({ statuses });
    } catch (error) {
      console.error('Error in GET /api/roadmap-progress:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/roadmap-progress
  app.put('/api/roadmap-progress', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { taskId, status } = req.body;

      if (!taskId || !status) {
        return res.status(400).json({ error: 'taskId and status are required' });
      }

      if (!['not_started', 'in_progress', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const { error } = await supabaseAdmin
        .from('roadmap_progress')
        .upsert(
          { user_id: user.id, task_id: taskId, status, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,task_id' }
        );

      if (error) {
        console.error('Error updating roadmap progress:', error);
        return res.status(500).json({ error: 'Failed to update progress' });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error('Error in PUT /api/roadmap-progress:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ==================== SHOPIFY STORES ====================

  function mapShopifyStoreFromDB(row: any) {
    const profile = row.profiles;
    return {
      id: row.id,
      user_id: row.user_id,
      name: row.store_name || row.shop_domain || '',
      url: row.shop_domain || '',
      logo: null,
      status: row.is_active ? 'connected' : 'disconnected',
      connected_at: row.created_at || new Date().toISOString(),
      last_synced_at: row.last_synced_at || null,
      sync_status: row.last_synced_at ? 'success' : 'never',
      api_key: '',
      access_token: row.access_token ? '••••••••' : '',
      products_count: 0,
      monthly_revenue: null,
      monthly_traffic: null,
      niche: null,
      country: null,
      currency: 'USD',
      plan: row.plan || 'basic',
      user: profile ? { id: row.user_id, email: profile.email, full_name: profile.full_name } : undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  // GET /api/shopify-stores
  app.get('/api/shopify-stores', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;
      const page = parseInt(req.query.page as string || '1');
      const pageSize = parseInt(req.query.pageSize as string || '50');
      const offset = (page - 1) * pageSize;

      let query = supabaseAdmin
        .from('shopify_stores')
        .select('*, profiles(email, full_name)', { count: 'exact' })
        .eq('user_id', user.id);

      if (status === 'connected') query = query.eq('is_active', true);
      else if (status === 'disconnected') query = query.eq('is_active', false);

      if (search) query = query.or(`store_name.ilike.%${search}%,shop_domain.ilike.%${search}%`);

      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching shopify stores:', error);
        return res.status(500).json({ error: 'Failed to fetch stores' });
      }

      const stores = (data || []).map(mapShopifyStoreFromDB);
      const totalCount = count || 0;

      return res.json({
        stores,
        total: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize)
      });
    } catch (error) {
      console.error('Error in GET /api/shopify-stores:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/shopify-stores
  app.post('/api/shopify-stores', requireAuth, async (req: Request, res: Response) => {
    try {
      const { shop } = req.body;

      if (!shop) {
        return res.status(400).json({ error: 'Shop parameter is required' });
      }

      const { generateOAuthState, buildShopifyOAuthUrl } = await import('../../src/lib/utils/shopify-oauth');

      const state = generateOAuthState();
      const oauthUrl = buildShopifyOAuthUrl(shop, state);

      return res.json({ oauth_url: oauthUrl, state: state });
    } catch (error) {
      console.error('Error in POST /api/shopify-stores:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/shopify-stores/:id
  app.get('/api/shopify-stores/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id: storeId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('shopify_stores')
        .select('*, profiles(email, full_name)')
        .eq('id', storeId)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Store not found' });
      }

      return res.json(mapShopifyStoreFromDB(data));
    } catch (error) {
      console.error('Error in GET /api/shopify-stores/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PATCH /api/shopify-stores/:id
  app.patch('/api/shopify-stores/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id: storeId } = req.params;
      const body = req.body;

      const { data: existing } = await supabaseAdmin
        .from('shopify_stores')
        .select('id')
        .eq('id', storeId)
        .eq('user_id', user.id)
        .single();

      if (!existing) {
        return res.status(404).json({ error: 'Store not found or access denied' });
      }

      const updateFields: Record<string, any> = { updated_at: new Date().toISOString() };

      if (body.name !== undefined) updateFields.store_name = body.name;
      if (body.url !== undefined) updateFields.shop_domain = body.url;
      if (body.status !== undefined) updateFields.is_active = body.status === 'connected';
      if (body.plan !== undefined) updateFields.plan = body.plan;

      const { data: result, error } = await supabaseAdmin
        .from('shopify_stores')
        .update(updateFields)
        .eq('id', storeId)
        .eq('user_id', user.id)
        .select('*, profiles(email, full_name)')
        .single();

      if (error || !result) {
        return res.status(404).json({ error: 'Store not found' });
      }

      return res.json(mapShopifyStoreFromDB(result));
    } catch (error) {
      console.error('Error in PATCH /api/shopify-stores/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE /api/shopify-stores/:id
  app.delete('/api/shopify-stores/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id: storeId } = req.params;

      const { data: existing } = await supabaseAdmin
        .from('shopify_stores')
        .select('id')
        .eq('id', storeId)
        .eq('user_id', user.id)
        .single();

      if (!existing) {
        return res.status(404).json({ error: 'Store not found or access denied' });
      }

      await supabaseAdmin
        .from('shopify_stores')
        .delete()
        .eq('id', storeId)
        .eq('user_id', user.id);

      return res.json({ success: true, message: 'Store deleted successfully' });
    } catch (error) {
      console.error('Error in DELETE /api/shopify-stores/[id]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/shopify-stores/:id/sync
  app.post('/api/shopify-stores/:id/sync', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id: storeId } = req.params;

      const { data: store, error: storeError } = await supabaseAdmin
        .from('shopify_stores')
        .select('id, user_id, shop_domain, access_token, is_active')
        .eq('id', storeId)
        .eq('user_id', user.id)
        .single();

      if (storeError || !store) {
        return res.status(404).json({ error: 'Store not found or access denied' });
      }

      if (!store.is_active) {
        return res.status(400).json({ error: 'Store must be connected to sync' });
      }

      if (!store.access_token) {
        return res.status(400).json({ error: 'Store access token is missing' });
      }

      await supabaseAdmin
        .from('shopify_stores')
        .update({ last_synced_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', storeId)
        .eq('user_id', user.id);

      const { data: updated } = await supabaseAdmin
        .from('shopify_stores')
        .select('*, profiles(email, full_name)')
        .eq('id', storeId)
        .single();

      const row = updated;
      const mappedStore = {
        id: row.id,
        user_id: row.user_id,
        name: row.store_name || row.shop_domain || '',
        url: row.shop_domain || '',
        status: row.is_active ? 'connected' : 'disconnected',
        connected_at: row.created_at,
        last_synced_at: row.last_synced_at,
        sync_status: 'success',
        plan: row.plan || 'basic',
        created_at: row.created_at,
        updated_at: row.updated_at,
      };

      return res.json({ success: true, message: 'Store synced successfully', store: mappedStore });
    } catch (error) {
      console.error('Error in POST /api/shopify-stores/[id]/sync:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/shopify-stores/oauth/callback
  app.get('/api/shopify-stores/oauth/callback', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const code = req.query.code as string | undefined;
      const state = req.query.state as string | undefined;
      const shop = req.query.shop as string | undefined;
      const error = req.query.error as string | undefined;

      if (error) {
        console.error('Shopify OAuth error:', error);
        return res.redirect(`/my-store?error=${encodeURIComponent(error)}`);
      }

      if (!code || !shop) {
        return res.redirect('/my-store?error=missing_parameters');
      }

      try {
        const { exchangeCodeForToken, fetchShopifyStoreInfo, mapShopifyPlan } = await import('../../src/lib/utils/shopify-oauth');
        const { normalizeShopifyStoreUrl } = await import('../../src/lib/utils/shopify-store-helpers');

        const { access_token } = await exchangeCodeForToken(shop, code, state || '');
        const storeInfo = await fetchShopifyStoreInfo(access_token, shop);
        const normalizedUrl = normalizeShopifyStoreUrl(storeInfo.myshopify_domain);

        const { data: existingStore } = await supabaseAdmin
          .from('shopify_stores')
          .select('id')
          .eq('user_id', user.id)
          .eq('url', normalizedUrl)
          .single();

        const now = new Date().toISOString();
        const plan = mapShopifyPlan(storeInfo.plan_name);

        if (existingStore) {
          const { error: updateError } = await supabaseAdmin
            .from('shopify_stores')
            .update({
              name: storeInfo.name,
              access_token: access_token,
              status: 'connected',
              connected_at: now,
              sync_status: 'never',
              currency: storeInfo.currency,
              plan: plan,
              updated_at: now,
            })
            .eq('id', existingStore.id)
            .select(`*, profiles(id, email, full_name)`)
            .single();

          if (updateError) {
            console.error('Error updating store:', updateError);
            return res.redirect('/my-store?error=update_failed');
          }

          return res.redirect('/my-store?success=store_updated');
        } else {
          const { error: createError } = await supabaseAdmin
            .from('shopify_stores')
            .insert({
              user_id: user.id,
              name: storeInfo.name,
              url: normalizedUrl,
              access_token: access_token,
              shopify_store_id: storeInfo.myshopify_domain,
              status: 'connected',
              connected_at: now,
              sync_status: 'never',
              products_count: 0,
              currency: storeInfo.currency,
              plan: plan,
              created_at: now,
              updated_at: now,
            })
            .select(`*, profiles(id, email, full_name)`)
            .single();

          if (createError) {
            console.error('Error creating store:', createError);
            if (createError.code === '23505') {
              return res.redirect('/my-store?error=store_already_exists');
            }
            return res.redirect('/my-store?error=create_failed');
          }

          return res.redirect('/my-store?success=store_connected');
        }
      } catch (oauthError) {
        console.error('OAuth flow error:', oauthError);
        const errorMessage = oauthError instanceof Error ? oauthError.message : 'Unknown error';
        return res.redirect(`/my-store?error=${encodeURIComponent(errorMessage)}`);
      }
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      return res.redirect('/my-store?error=internal_error');
    }
  });

  // ==================== USER CREDENTIALS ====================

  // GET /api/user-credentials
  app.get('/api/user-credentials', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const { data, error } = await supabaseAdmin
        .from('user_credentials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.json(data || []);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/user-credentials
  app.post('/api/user-credentials', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { service_name, service_url, username, password, notes } = req.body;

      if (!service_name) {
        return res.status(400).json({ error: 'Service name is required' });
      }

      const { data, error } = await supabaseAdmin
        .from('user_credentials')
        .insert({
          user_id: user.id,
          service_name,
          service_url: service_url || null,
          username: username || null,
          password: password || null,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/user-credentials
  app.put('/api/user-credentials', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id, service_name, service_url, username, password, notes } = req.body;

      if (!id) return res.status(400).json({ error: 'Credential ID is required' });
      if (!service_name) return res.status(400).json({ error: 'Service name is required' });

      const { data, error } = await supabaseAdmin
        .from('user_credentials')
        .update({
          service_name,
          service_url: service_url || null,
          username: username || null,
          password: password || null,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE /api/user-credentials
  app.delete('/api/user-credentials', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      let id = req.query.id as string | undefined;

      if (!id) {
        try {
          id = req.body?.id;
        } catch {}
      }

      if (!id) return res.status(400).json({ error: 'Credential ID is required' });

      const { error } = await supabaseAdmin
        .from('user_credentials')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ==================== USER DETAILS ====================

  // GET /api/user-details
  app.get('/api/user-details', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const { data } = await supabaseAdmin
        .from('user_details')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      return res.json({ ...(data || {}), email: user.email });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/user-details
  app.put('/api/user-details', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const body = req.body;

      const { email, id, created_at, updated_at, ...details } = body;

      const { data, error } = await supabaseAdmin
        .from('user_details')
        .upsert(
          { ...details, user_id: user.id, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json({ ...data, email: user.email });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}

// ==================== HELPER FUNCTIONS ====================

function calculateQuizScore(
  questions: any[],
  answers: Record<string, any>
): { score: number; passed: boolean; feedback: Record<string, { correct: boolean; explanation?: string }> } {
  let correctCount = 0;
  const feedback: Record<string, { correct: boolean; explanation?: string }> = {};

  questions.forEach((question: any, index: number) => {
    const answerKey = question.id || `question_${index}`;
    const userAnswer = answers[answerKey];
    let isCorrect = false;

    if (question.type === 'multiple-choice') {
      isCorrect = userAnswer === question.correct_answer;
    } else if (question.type === 'true-false') {
      isCorrect = String(userAnswer).toLowerCase() === String(question.correct_answer).toLowerCase();
    } else if (question.type === 'short-answer') {
      isCorrect = String(userAnswer).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase();
    }

    if (isCorrect) correctCount++;

    feedback[answerKey] = { correct: isCorrect, explanation: question.explanation };
  });

  const totalQuestions = questions.length;
  const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
  const passed = score >= 70;

  return { score, passed, feedback };
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
      id: cat.id, name: cat.name, slug: cat.slug, description: cat.description,
      image: cat.image, parent_category_id: cat.parent_category_id, trending: cat.trending,
      product_count: cat.product_count, avg_profit_margin: cat.avg_profit_margin,
      growth_percentage: cat.growth_percentage, created_at: cat.created_at, updated_at: cat.updated_at,
    } : null,
    buy_price: parseFloat(row.buy_price),
    sell_price: parseFloat(row.sell_price),
    profit_per_order: parseFloat(row.profit_per_order),
    additional_images: Array.isArray(row.additional_images) ? row.additional_images : [],
    specifications: row.specifications || null,
    rating: row.rating ? parseFloat(row.rating) : null,
    reviews_count: row.reviews_count || 0,
    trend_data: Array.isArray(row.trend_data) ? row.trend_data : [],
    supplier_id: row.supplier_id,
    supplier: sup ? {
      id: sup.id, name: sup.name, company_name: sup.name, logo: null,
      website: sup.website, country: sup.country, rating: sup.rating, verified: sup.verified,
      shipping_time: sup.shipping_time, min_order_quantity: sup.min_order_quantity,
      contact_email: sup.contact_email, created_at: sup.created_at, updated_at: sup.updated_at,
    } : null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    metadata: meta ? {
      id: meta.id, product_id: row.id, is_winning: meta.is_winning || false,
      is_locked: meta.is_locked || false,
      unlock_price: meta.unlock_price ? parseFloat(meta.unlock_price) : null,
      profit_margin: meta.profit_margin ? parseFloat(meta.profit_margin) : null,
      pot_revenue: meta.pot_revenue ? parseFloat(meta.pot_revenue) : null,
      revenue_growth_rate: meta.revenue_growth_rate ? parseFloat(meta.revenue_growth_rate) : null,
      items_sold: meta.items_sold,
      avg_unit_price: meta.avg_unit_price ? parseFloat(meta.avg_unit_price) : null,
      revenue_trend: meta.revenue_trend || [], found_date: meta.found_date,
      detailed_analysis: meta.detailed_analysis, filters: meta.filters || [],
      created_at: meta.created_at, updated_at: meta.updated_at,
    } : undefined,
    source: src ? {
      id: src.id, product_id: row.id, source_type: src.source_type,
      source_id: src.source_id, standardized_at: src.standardized_at,
      standardized_by: src.standardized_by, created_at: src.created_at, updated_at: src.updated_at,
    } : undefined,
  };
}

async function updateUserProgressPercentage(userId: string) {
  try {
    const { count: totalVideos } = await supabaseAdmin
      .from('onboarding_videos')
      .select('*', { count: 'exact', head: true });

    if (!totalVideos || totalVideos === 0) return;

    const { count: completedVideos } = await supabaseAdmin
      .from('onboarding_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true);

    const progressPercentage = Math.round(((completedVideos || 0) / totalVideos) * 100);
    const allCompleted = completedVideos === totalVideos;

    const updateData: any = {
      onboarding_progress: progressPercentage,
      updated_at: new Date().toISOString(),
    };

    if (allCompleted) {
      updateData.onboarding_completed = true;
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('onboarding_completed_at')
        .eq('id', userId)
        .single();

      if (!profile?.onboarding_completed_at) {
        updateData.onboarding_completed_at = new Date().toISOString();
      }
    }

    await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId);
  } catch (error) {
    console.error('Error updating progress percentage:', error);
  }
}
