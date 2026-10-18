import { requireRole } from '../middleware/requireRole.js'

export function registerAdminRoutes(app, { admin }, authenticate) {
  const guard = [authenticate, requireRole('administrator')]

  // GET /admin/stats
  app.get('/admin/stats', ...guard, (req, res, next) => {
    try {
      res.json(admin.getStats())
    } catch (err) {
      next(err)
    }
  })

  // GET /admin/users?role=&status=&search=
  app.get('/admin/users', ...guard, (req, res, next) => {
    try {
      const { role, status, search } = req.query
      res.json(admin.listUsers({ role, status, search }))
    } catch (err) {
      next(err)
    }
  })

  // GET /admin/users/:id
  app.get('/admin/users/:id', ...guard, (req, res, next) => {
    try {
      res.json(admin.getUserById(req.params.id))
    } catch (err) {
      next(err)
    }
  })

  // POST /admin/users  — tạo tài khoản nội bộ
  app.post('/admin/users', ...guard, (req, res, next) => {
    try {
      res.status(201).json(admin.createInternalAccount(req.body))
    } catch (err) {
      next(err)
    }
  })

  // PUT /admin/users/:id  — cập nhật tài khoản
  app.put('/admin/users/:id', ...guard, (req, res, next) => {
    try {
      res.json(admin.updateUser(req.params.id, req.body, req.user?.id))
    } catch (err) {
      next(err)
    }
  })

  // PATCH /admin/users/:id/toggle-status  — bật/tắt tài khoản
  app.patch('/admin/users/:id/toggle-status', ...guard, (req, res, next) => {
    try {
      res.json(admin.toggleStatus(req.params.id, req.user?.id))
    } catch (err) {
      next(err)
    }
  })
}

