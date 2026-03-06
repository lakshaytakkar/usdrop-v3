import { type Express, Router, Request, Response, NextFunction } from 'express';
import { requireAdmin } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
});

function handleMulterUpload(req: Request, res: Response, next: NextFunction) {
  upload.single('video')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (err) {
      return res.status(400).json({ error: err.message || 'Invalid file' });
    }
    next();
  });
}

const BUCKET = 'videos';

export function registerAdminVideoRoutes(app: Express) {
  const router = Router();
  router.use(requireAdmin);

  router.get('/videos', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseRemote
        .from('ad_videos')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Fetch ad_videos error:', error);
        return res.status(500).json({ error: 'Failed to fetch videos' });
      }

      res.json(data || []);
    } catch (err) {
      console.error('Videos error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/videos', handleMulterUpload, async (req: Request, res: Response) => {
    try {
      const { title, category, views, likes, is_published, order_index, thumbnail_url } = req.body;

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (!category) {
        return res.status(400).json({ error: 'Category is required' });
      }

      const parsedViews = views ? Math.max(0, parseInt(views) || 0) : 0;
      const parsedLikes = likes ? Math.max(0, parseInt(likes) || 0) : 0;

      let videoUrl = '';

      if (req.file) {
        const timestamp = Date.now();
        const safeName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const ext = req.file.originalname.split('.').pop() || 'mp4';
        const filePath = `${safeName}-${timestamp}.${ext}`;

        const { error: uploadError } = await supabaseRemote.storage
          .from(BUCKET)
          .upload(filePath, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          return res.status(500).json({ error: `Failed to upload video: ${uploadError.message}` });
        }

        const { data: urlData } = supabaseRemote.storage.from(BUCKET).getPublicUrl(filePath);
        videoUrl = urlData.publicUrl;
      } else if (req.body.video_url) {
        videoUrl = req.body.video_url;
      } else {
        return res.status(400).json({ error: 'A video file or video URL is required' });
      }

      const { data, error } = await supabaseRemote
        .from('ad_videos')
        .insert({
          title: title.trim(),
          video_url: videoUrl,
          thumbnail_url: thumbnail_url || '',
          category,
          views: parsedViews,
          likes: parsedLikes,
          is_published: is_published !== 'false',
          order_index: Math.max(0, parseInt(order_index) || 0),
          date_added: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) {
        console.error('Insert ad_video error:', error);
        return res.status(500).json({ error: 'Failed to create video record' });
      }

      res.status(201).json(data);
    } catch (err) {
      console.error('Create video error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/videos/:id', handleMulterUpload, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates: Record<string, any> = {};

      if (req.body.title !== undefined) {
        if (typeof req.body.title !== 'string' || req.body.title.trim().length === 0) {
          return res.status(400).json({ error: 'Title cannot be empty' });
        }
        updates.title = req.body.title.trim();
      }
      if (req.body.category !== undefined) updates.category = req.body.category;
      if (req.body.views !== undefined) updates.views = Math.max(0, parseInt(req.body.views) || 0);
      if (req.body.likes !== undefined) updates.likes = Math.max(0, parseInt(req.body.likes) || 0);
      if (req.body.is_published !== undefined) updates.is_published = req.body.is_published === 'true';
      if (req.body.order_index !== undefined) updates.order_index = parseInt(req.body.order_index) || 0;
      if (req.body.thumbnail_url !== undefined) updates.thumbnail_url = req.body.thumbnail_url;

      if (req.file) {
        const { data: existing } = await supabaseRemote
          .from('ad_videos')
          .select('video_url')
          .eq('id', id)
          .single();

        if (existing?.video_url?.includes('supabase.co/storage')) {
          const oldPath = existing.video_url.split('/videos/').pop();
          if (oldPath) {
            await supabaseRemote.storage.from(BUCKET).remove([decodeURIComponent(oldPath)]);
          }
        }

        const timestamp = Date.now();
        const safeName = (req.body.title || 'video').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const ext = req.file.originalname.split('.').pop() || 'mp4';
        const filePath = `${safeName}-${timestamp}.${ext}`;

        const { error: uploadError } = await supabaseRemote.storage
          .from(BUCKET)
          .upload(filePath, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          return res.status(500).json({ error: `Failed to upload video: ${uploadError.message}` });
        }

        const { data: urlData } = supabaseRemote.storage.from(BUCKET).getPublicUrl(filePath);
        updates.video_url = urlData.publicUrl;
      } else if (req.body.video_url !== undefined) {
        updates.video_url = req.body.video_url;
      }

      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabaseRemote
        .from('ad_videos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update ad_video error:', error);
        return res.status(500).json({ error: 'Failed to update video' });
      }

      res.json(data);
    } catch (err) {
      console.error('Update video error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/videos/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data: existing } = await supabaseRemote
        .from('ad_videos')
        .select('video_url')
        .eq('id', id)
        .single();

      if (existing?.video_url?.includes('supabase.co/storage')) {
        const path = existing.video_url.split('/videos/').pop();
        if (path) {
          await supabaseRemote.storage.from(BUCKET).remove([decodeURIComponent(path)]);
        }
      }

      const { error } = await supabaseRemote
        .from('ad_videos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete ad_video error:', error);
        return res.status(500).json({ error: 'Failed to delete video' });
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Delete video error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/videos/reorder', async (req: Request, res: Response) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'items array is required' });
      }

      for (const item of items) {
        await supabaseRemote
          .from('ad_videos')
          .update({ order_index: item.order_index, updated_at: new Date().toISOString() })
          .eq('id', item.id);
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Reorder error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const publicRouter = Router();

  publicRouter.get('/ad-videos', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseRemote
        .from('ad_videos')
        .select('id, title, video_url, thumbnail_url, category, views, likes, date_added')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Fetch public ad_videos error:', error);
        return res.status(500).json({ error: 'Failed to fetch videos' });
      }

      res.json(data || []);
    } catch (err) {
      console.error('Public videos error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/admin', router);
  app.use('/api', publicRouter);
}
