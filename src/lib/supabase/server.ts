import sql from '@/lib/db'
import { getCurrentUser, type AuthUser } from '@/lib/auth'

export async function createClient() {
  const user = await getCurrentUser()
  
  return {
    auth: {
      getUser: async () => {
        if (!user) return { data: { user: null }, error: { message: 'Not authenticated' } }
        return { data: { user: { id: user.id, email: user.email, user_metadata: { full_name: user.full_name, avatar_url: user.avatar_url } } }, error: null }
      },
      getSession: async () => {
        if (!user) return { data: { session: null }, error: null }
        return { data: { session: { user: { id: user.id, email: user.email } } }, error: null }
      },
      signOut: async () => {
        return { error: null }
      },
    },
    from: (table: string) => createQueryBuilder(table),
    sql,
  }
}

export function createAdminClient() {
  return {
    auth: {
      admin: {
        listUsers: async () => {
          const users = await sql`SELECT * FROM profiles`
          return { data: { users }, error: null }
        },
      }
    },
    from: (table: string) => createQueryBuilder(table),
    sql,
  }
}

function createQueryBuilder(table: string) {
  let selectFields = '*'
  let conditions: { column: string; value: any; op: string }[] = []
  let orConditions: string[] = []
  let orderByField: string | null = null
  let orderDirection: string = 'asc'
  let nullsFirst: boolean | null = null
  let limitCount: number | null = null
  let offsetCount: number | null = null
  let isSingle = false
  let isCount = false
  let countType = 'exact'

  const builder: any = {
    select(fields: string = '*', opts?: { count?: string }) {
      selectFields = fields
      if (opts?.count) {
        isCount = true
        countType = opts.count
      }
      return builder
    },
    eq(column: string, value: any) {
      conditions.push({ column, value, op: '=' })
      return builder
    },
    neq(column: string, value: any) {
      conditions.push({ column, value, op: '!=' })
      return builder
    },
    gt(column: string, value: any) {
      conditions.push({ column, value, op: '>' })
      return builder
    },
    gte(column: string, value: any) {
      conditions.push({ column, value, op: '>=' })
      return builder
    },
    lt(column: string, value: any) {
      conditions.push({ column, value, op: '<' })
      return builder
    },
    lte(column: string, value: any) {
      conditions.push({ column, value, op: '<=' })
      return builder
    },
    ilike(column: string, value: any) {
      conditions.push({ column, value, op: 'ILIKE' })
      return builder
    },
    in(column: string, values: any[]) {
      conditions.push({ column, value: values, op: 'IN' })
      return builder
    },
    is(column: string, value: any) {
      conditions.push({ column, value, op: 'IS' })
      return builder
    },
    or(filterString: string) {
      orConditions.push(filterString)
      return builder
    },
    not(column: string, op: string, value: any) {
      if (op === 'is') {
        conditions.push({ column, value, op: 'IS NOT' })
      }
      return builder
    },
    order(column: string, opts?: { ascending?: boolean; nullsFirst?: boolean }) {
      orderByField = column
      orderDirection = opts?.ascending === false ? 'DESC' : 'ASC'
      if (opts?.nullsFirst !== undefined) {
        nullsFirst = opts.nullsFirst
      }
      return builder
    },
    limit(count: number) {
      limitCount = count
      return builder
    },
    range(from: number, to: number) {
      offsetCount = from
      limitCount = to - from + 1
      return builder
    },
    single() {
      isSingle = true
      limitCount = 1
      return builder.then()
    },
    maybeSingle() {
      isSingle = true
      limitCount = 1
      return builder.then()
    },
    async then(resolve?: Function, reject?: Function) {
      try {
        const result = await executeQuery(table, selectFields, conditions, orderByField, orderDirection, limitCount, offsetCount, isSingle, isCount, orConditions, nullsFirst)
        const ret = resolve ? resolve(result) : result
        return ret
      } catch (err: any) {
        if (reject) return reject(err)
        return { data: isSingle ? null : [], error: { message: err.message }, count: 0 }
      }
    },
    insert(data: any | any[]) {
      return createInsertBuilder(table, data)
    },
    update(data: any) {
      return createUpdateBuilder(table, data, conditions)
    },
    delete() {
      return createDeleteBuilder(table, conditions)
    },
    upsert(data: any | any[], opts?: { onConflict?: string }) {
      return createUpsertBuilder(table, data, opts?.onConflict)
    },
  }

  return builder
}

async function executeQuery(
  table: string, fields: string, conditions: any[], 
  orderBy: string | null, orderDir: string,
  limit: number | null, offset: number | null,
  isSingle: boolean, isCount: boolean,
  orConditions: string[] = [], nullsFirstOpt: boolean | null = null
) {
  let parsedFields = fields
  let joinTable: string | null = null
  let joinFields: string[] = []
  
  const joinMatch = fields.match(/(\w+)\s*\(([^)]+)\)/)
  if (joinMatch) {
    joinTable = joinMatch[1]
    joinFields = joinMatch[2].split(',').map(f => f.trim())
    parsedFields = fields.replace(/,?\s*\w+\s*\([^)]+\)/, '').trim()
    if (parsedFields.endsWith(',')) parsedFields = parsedFields.slice(0, -1).trim()
    if (!parsedFields || parsedFields === '') parsedFields = `${table}.*`
    
    const joinSelectFields = joinFields.map(f => `${joinTable}.${f} as ${joinTable}_${f}`).join(', ')
    parsedFields = `${parsedFields}, ${joinSelectFields}`
  }

  let query = `SELECT ${parsedFields === '*' ? `${table}.*` : parsedFields} FROM ${table}`
  
  if (joinTable) {
    const joinColumn = `${joinTable.replace(/s$/, '')}_id`
    query += ` LEFT JOIN ${joinTable} ON ${table}.${joinColumn} = ${joinTable}.id`
  }

  const values: any[] = []
  const whereParts: string[] = []
  
  if (conditions.length > 0) {
    conditions.forEach((cond, i) => {
      const col = cond.column.includes('.') ? cond.column : `${table}.${cond.column}`
      if (cond.op === 'IS' || cond.op === 'IS NOT') {
        whereParts.push(`${col} ${cond.op} ${cond.value === null ? 'NULL' : cond.value}`)
      } else if (cond.op === 'IN') {
        const placeholders = cond.value.map((_: any, j: number) => `$${values.length + j + 1}`).join(', ')
        whereParts.push(`${col} IN (${placeholders})`)
        values.push(...cond.value)
      } else {
        values.push(cond.value)
        whereParts.push(`${col} ${cond.op} $${values.length}`)
      }
    })
  }

  if (orConditions.length > 0) {
    orConditions.forEach(filterStr => {
      const parts = filterStr.split(',')
      const orParts: string[] = []
      parts.forEach(part => {
        const segments = part.split('.')
        if (segments.length >= 3) {
          const col = segments[0].includes('.') ? segments[0] : `${table}.${segments[0]}`
          const op = segments[1].toLowerCase()
          const val = segments.slice(2).join('.')
          if (op === 'ilike') {
            values.push(val)
            orParts.push(`${col} ILIKE $${values.length}`)
          } else if (op === 'eq') {
            values.push(val)
            orParts.push(`${col} = $${values.length}`)
          } else if (op === 'neq') {
            values.push(val)
            orParts.push(`${col} != $${values.length}`)
          } else if (op === 'like') {
            values.push(val)
            orParts.push(`${col} LIKE $${values.length}`)
          }
        }
      })
      if (orParts.length > 0) {
        whereParts.push(`(${orParts.join(' OR ')})`)
      }
    })
  }

  if (whereParts.length > 0) {
    query += ` WHERE ${whereParts.join(' AND ')}`
  }

  if (orderBy) {
    let orderSuffix = ''
    if (nullsFirstOpt !== null) {
      orderSuffix = nullsFirstOpt ? ' NULLS FIRST' : ' NULLS LAST'
    }
    query += ` ORDER BY ${orderBy} ${orderDir}${orderSuffix}`
  }
  if (limit) {
    query += ` LIMIT ${limit}`
  }
  if (offset) {
    query += ` OFFSET ${offset}`
  }

  const result = await sql.unsafe(query, values)
  
  if (joinTable && result.length > 0) {
    result.forEach((row: any) => {
      const joinObj: any = {}
      let hasJoinData = false
      joinFields.forEach(f => {
        const key = `${joinTable}_${f}`
        if (row[key] !== undefined) {
          joinObj[f] = row[key]
          if (row[key] !== null) hasJoinData = true
          delete row[key]
        }
      })
      row[joinTable!] = hasJoinData ? joinObj : null
    })
  }

  if (isCount) {
    const countResult = await sql.unsafe(`SELECT COUNT(*) as count FROM ${table}${conditions.length > 0 ? ` WHERE ${conditions.map((c, i) => {
      if (c.op === 'IS' || c.op === 'IS NOT') return `${c.column} ${c.op} ${c.value === null ? 'NULL' : c.value}`
      return `${c.column} ${c.op} $${i + 1}`
    }).join(' AND ')}` : ''}`, values.filter((_, i) => conditions[i]?.op !== 'IS' && conditions[i]?.op !== 'IS NOT'))
    const count = parseInt(countResult[0]?.count || '0')
    return { data: isSingle ? (result[0] || null) : result, error: null, count }
  }

  if (isSingle) {
    return { data: result[0] || null, error: result.length === 0 ? { message: 'No rows found', code: 'PGRST116' } : null }
  }

  return { data: result, error: null }
}

function createInsertBuilder(table: string, data: any | any[]) {
  const rows = Array.isArray(data) ? data : [data]
  let selectFields = '*'
  let isSingle = false
  
  const builder: any = {
    select(fields: string = '*') {
      selectFields = fields
      return builder
    },
    single() {
      isSingle = true
      return builder.then()
    },
    async then(resolve?: Function, reject?: Function) {
      try {
        if (rows.length === 0) return resolve ? resolve({ data: [], error: null }) : { data: [], error: null }
        
        const columns = Object.keys(rows[0])
        const valueSets: string[] = []
        const values: any[] = []
        
        rows.forEach((row: any) => {
          const placeholders = columns.map((_, j) => `$${values.length + j + 1}`)
          valueSets.push(`(${placeholders.join(', ')})`)
          columns.forEach(col => values.push(row[col] !== undefined ? (typeof row[col] === 'object' && row[col] !== null ? JSON.stringify(row[col]) : row[col]) : null))
        })

        const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${valueSets.join(', ')} RETURNING ${selectFields}`
        const result = await sql.unsafe(query, values)
        
        const ret = { data: isSingle ? (result[0] || null) : result, error: null }
        return resolve ? resolve(ret) : ret
      } catch (err: any) {
        const ret = { data: null, error: { message: err.message } }
        return reject ? reject(err) : ret
      }
    }
  }
  return builder
}

function createUpdateBuilder(table: string, data: any, existingConditions: any[]) {
  let conditions = [...existingConditions]
  let selectFields = '*'
  let isSingle = false

  const builder: any = {
    eq(column: string, value: any) {
      conditions.push({ column, value, op: '=' })
      return builder
    },
    select(fields: string = '*') {
      selectFields = fields
      return builder
    },
    single() {
      isSingle = true
      return builder.then()
    },
    async then(resolve?: Function, reject?: Function) {
      try {
        const columns = Object.keys(data)
        const values: any[] = []
        const setParts = columns.map((col, i) => {
          values.push(typeof data[col] === 'object' && data[col] !== null ? JSON.stringify(data[col]) : data[col])
          return `${col} = $${i + 1}`
        })

        const whereParts: string[] = []
        conditions.forEach(cond => {
          values.push(cond.value)
          whereParts.push(`${cond.column} ${cond.op} $${values.length}`)
        })

        const query = `UPDATE ${table} SET ${setParts.join(', ')} WHERE ${whereParts.join(' AND ')} RETURNING ${selectFields}`
        const result = await sql.unsafe(query, values)

        const ret = { data: isSingle ? (result[0] || null) : result, error: null }
        return resolve ? resolve(ret) : ret
      } catch (err: any) {
        const ret = { data: null, error: { message: err.message } }
        return reject ? reject(err) : ret
      }
    }
  }
  return builder
}

function createDeleteBuilder(table: string, existingConditions: any[]) {
  let conditions = [...existingConditions]

  const builder: any = {
    eq(column: string, value: any) {
      conditions.push({ column, value, op: '=' })
      return builder
    },
    async then(resolve?: Function, reject?: Function) {
      try {
        const values: any[] = []
        const whereParts: string[] = []
        conditions.forEach(cond => {
          values.push(cond.value)
          whereParts.push(`${cond.column} ${cond.op} $${values.length}`)
        })

        const query = `DELETE FROM ${table} WHERE ${whereParts.join(' AND ')}`
        await sql.unsafe(query, values)

        const ret = { data: null, error: null }
        return resolve ? resolve(ret) : ret
      } catch (err: any) {
        const ret = { data: null, error: { message: err.message } }
        return reject ? reject(err) : ret
      }
    }
  }
  return builder
}

function createUpsertBuilder(table: string, data: any | any[], onConflict?: string) {
  const rows = Array.isArray(data) ? data : [data]
  let selectFields = '*'
  let isSingle = false

  const builder: any = {
    select(fields: string = '*') {
      selectFields = fields
      return builder
    },
    single() {
      isSingle = true
      return builder.then()
    },
    async then(resolve?: Function, reject?: Function) {
      try {
        if (rows.length === 0) return resolve ? resolve({ data: [], error: null }) : { data: [], error: null }

        const columns = Object.keys(rows[0])
        const valueSets: string[] = []
        const values: any[] = []

        rows.forEach((row: any) => {
          const placeholders = columns.map((_, j) => `$${values.length + j + 1}`)
          valueSets.push(`(${placeholders.join(', ')})`)
          columns.forEach(col => values.push(row[col] !== undefined ? (typeof row[col] === 'object' && row[col] !== null ? JSON.stringify(row[col]) : row[col]) : null))
        })

        const conflict = onConflict || 'id'
        const updateParts = columns.filter(c => c !== conflict).map(c => `${c} = EXCLUDED.${c}`)
        
        const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${valueSets.join(', ')} ON CONFLICT (${conflict}) DO UPDATE SET ${updateParts.join(', ')} RETURNING ${selectFields}`
        const result = await sql.unsafe(query, values)

        const ret = { data: isSingle ? (result[0] || null) : result, error: null }
        return resolve ? resolve(ret) : ret
      } catch (err: any) {
        const ret = { data: null, error: { message: err.message } }
        return reject ? reject(err) : ret
      }
    }
  }
  return builder
}

export const supabaseAdmin = createAdminClient()
