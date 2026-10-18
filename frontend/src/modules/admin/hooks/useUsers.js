import { useCallback, useEffect, useState } from 'react'
import { adminApi } from '../api/adminApi'

export function useUsers(filters = {}) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const result = await adminApi.listUsers(filters)
    setLoading(false)
    if (result.error) setError(result.error)
    else setUsers(result.data || [])
  }, [filters?.role, filters?.status, filters?.search]) // eslint-disable-line

  useEffect(() => {
    load()
  }, [load])

  return { users, loading, error, reload: load, setUsers }
}

