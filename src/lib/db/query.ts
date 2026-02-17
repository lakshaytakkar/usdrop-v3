import { sql } from './index'

type FilterType = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'is' | 'in' | 'ilike' | 'or'

interface Filter {
  type: FilterType
  column: string
  value: any
}

interface OrderClause {
  column: string
  ascending: boolean
  nullsFirst: boolean
}

interface JoinSpec {
  table: string
  columns: string
  isInner: boolean
}

interface QueryResult {
  data: any
  error: any
  count?: number
}

const REVERSE_FK_TABLES: Record<string, boolean> = {
  'product_metadata': true,
  'product_source': true,
  'course_modules': true,
  'course_chapters': true,
  'order_items': true,
  'user_shopify_stores': true,
}

function singularize(table: string): string {
  if (table.endsWith('ies')) return table.slice(0, -3) + 'y'
  if (table.endsWith('ses')) return table.slice(0, -2)
  if (table.endsWith('s')) return table.slice(0, -1)
  return table
}

function inferForeignKey(mainTable: string, joinTable: string): { column: string, on: 'main' | 'join' } {
  if (REVERSE_FK_TABLES[joinTable]) {
    const mainSingular = singularize(mainTable)
    return { column: `${mainSingular}_id`, on: 'join' }
  }
  const joinSingular = singularize(joinTable)
  return { column: `${joinSingular}_id`, on: 'main' }
}

function parseSelectString(selectStr: string): { mainColumns: string[], joins: JoinSpec[] } {
  const joins: JoinSpec[] = []
  const mainColumns: string[] = []

  const parts: string[] = []
  let depth = 0
  let current = ''
  for (let i = 0; i < selectStr.length; i++) {
    const ch = selectStr[i]
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      parts.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) parts.push(current.trim())

  for (const part of parts) {
    const joinMatch = part.match(/^(\w+?)(!inner)?\((.+)\)$/)
    if (joinMatch) {
      joins.push({
        table: joinMatch[1],
        columns: joinMatch[3],
        isInner: joinMatch[2] === '!inner',
      })
    } else {
      mainColumns.push(part)
    }
  }

  return { mainColumns, joins }
}

function parseOrFilter(filterStr: string): string {
  const conditions: string[] = []
  const parts = filterStr.split(',')

  for (const part of parts) {
    const dotIndex = part.indexOf('.')
    if (dotIndex === -1) continue
    const column = part.substring(0, dotIndex)
    const rest = part.substring(dotIndex + 1)
    const secondDot = rest.indexOf('.')
    if (secondDot === -1) continue
    const operator = rest.substring(0, secondDot)
    const value = rest.substring(secondDot + 1)

    switch (operator) {
      case 'eq':
        conditions.push(`"${column}" = ${escapeLiteral(value)}`)
        break
      case 'neq':
        conditions.push(`"${column}" != ${escapeLiteral(value)}`)
        break
      case 'gt':
        conditions.push(`"${column}" > ${escapeLiteral(value)}`)
        break
      case 'gte':
        conditions.push(`"${column}" >= ${escapeLiteral(value)}`)
        break
      case 'lt':
        conditions.push(`"${column}" < ${escapeLiteral(value)}`)
        break
      case 'lte':
        conditions.push(`"${column}" <= ${escapeLiteral(value)}`)
        break
      case 'ilike':
        conditions.push(`"${column}" ILIKE ${escapeLiteral(value)}`)
        break
      case 'like':
        conditions.push(`"${column}" LIKE ${escapeLiteral(value)}`)
        break
      case 'is':
        if (value === 'null') {
          conditions.push(`"${column}" IS NULL`)
        } else if (value === 'true') {
          conditions.push(`"${column}" IS TRUE`)
        } else if (value === 'false') {
          conditions.push(`"${column}" IS FALSE`)
        }
        break
      default:
        conditions.push(`"${column}" = ${escapeLiteral(value)}`)
    }
  }

  return `(${conditions.join(' OR ')})`
}

function escapeLiteral(value: any): string {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
  const str = String(value)
  return `'${str.replace(/'/g, "''")}'`
}

function escapeIdentifier(name: string): string {
  if (name === '*') return '*'
  if (name.includes('.')) {
    return name.split('.').map(p => `"${p.replace(/"/g, '""')}"`).join('.')
  }
  return `"${name.replace(/"/g, '""')}"`
}

function buildColumnsSQL(columns: string[]): string {
  if (columns.length === 0 || (columns.length === 1 && columns[0] === '*')) return '*'
  return columns.map(c => {
    const trimmed = c.trim()
    if (trimmed === '*') return '*'
    return escapeIdentifier(trimmed)
  }).join(', ')
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
  if (Array.isArray(value)) return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`
  if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`
  return escapeLiteral(value)
}

class QueryBuilder {
  private tableName: string
  private selectColumns: string = '*'
  private filters: Filter[] = []
  private orderClauses: OrderClause[] = []
  private limitVal: number | null = null
  private offsetVal: number | null = null
  private _isSingle: boolean = false
  private _isMaybeSingle: boolean = false
  private _isInsert: boolean = false
  private _isUpdate: boolean = false
  private _isDelete: boolean = false
  private _isUpsert: boolean = false
  private insertData: any = null
  private updateData: any = null
  private upsertConflict: string = ''
  private _shouldSelect: boolean = false
  private countMode: 'exact' | null = null
  private headOnly: boolean = false
  private joinSpecs: JoinSpec[] = []
  private _mainColumns: string[] = ['*']

  constructor(table: string) {
    this.tableName = table
  }

  select(columns: string = '*', options?: { count?: 'exact', head?: boolean }): QueryBuilder {
    if (this._isInsert || this._isUpdate || this._isUpsert) {
      this._shouldSelect = true
      if (columns !== '*') {
        const parsed = parseSelectString(columns)
        this._mainColumns = parsed.mainColumns
      }
      return this
    }

    this.selectColumns = columns
    if (options?.count === 'exact') {
      this.countMode = 'exact'
    }
    if (options?.head) {
      this.headOnly = true
    }

    const parsed = parseSelectString(columns)
    this._mainColumns = parsed.mainColumns
    this.joinSpecs = parsed.joins

    return this
  }

  insert(data: any): QueryBuilder {
    this._isInsert = true
    this.insertData = data
    return this
  }

  update(data: any): QueryBuilder {
    this._isUpdate = true
    this.updateData = data
    return this
  }

  upsert(data: any, options?: { onConflict?: string }): QueryBuilder {
    this._isUpsert = true
    this.insertData = data
    this.upsertConflict = options?.onConflict || ''
    return this
  }

  delete(): QueryBuilder {
    this._isDelete = true
    return this
  }

  eq(column: string, value: any): QueryBuilder {
    this.filters.push({ type: 'eq', column, value })
    return this
  }

  neq(column: string, value: any): QueryBuilder {
    this.filters.push({ type: 'neq', column, value })
    return this
  }

  gt(column: string, value: any): QueryBuilder {
    this.filters.push({ type: 'gt', column, value })
    return this
  }

  gte(column: string, value: any): QueryBuilder {
    this.filters.push({ type: 'gte', column, value })
    return this
  }

  lt(column: string, value: any): QueryBuilder {
    this.filters.push({ type: 'lt', column, value })
    return this
  }

  lte(column: string, value: any): QueryBuilder {
    this.filters.push({ type: 'lte', column, value })
    return this
  }

  is(column: string, value: any): QueryBuilder {
    this.filters.push({ type: 'is', column, value })
    return this
  }

  in(column: string, values: any[]): QueryBuilder {
    this.filters.push({ type: 'in', column, value: values })
    return this
  }

  or(filterString: string): QueryBuilder {
    this.filters.push({ type: 'or', column: '', value: filterString })
    return this
  }

  ilike(column: string, pattern: string): QueryBuilder {
    this.filters.push({ type: 'ilike', column, value: pattern })
    return this
  }

  order(column: string, options?: { ascending?: boolean, nullsFirst?: boolean }): QueryBuilder {
    this.orderClauses.push({
      column,
      ascending: options?.ascending ?? true,
      nullsFirst: options?.nullsFirst ?? false,
    })
    return this
  }

  limit(n: number): QueryBuilder {
    this.limitVal = n
    return this
  }

  range(from: number, to: number): QueryBuilder {
    this.offsetVal = from
    this.limitVal = to - from + 1
    return this
  }

  single(): QueryBuilder {
    this._isSingle = true
    this.limitVal = 1
    return this
  }

  maybeSingle(): QueryBuilder {
    this._isMaybeSingle = true
    this.limitVal = 1
    return this
  }

  private buildWhereClause(): string {
    const mainTableFilters: Filter[] = []
    const joinTableFilters: Map<string, Filter[]> = new Map()

    for (const filter of this.filters) {
      if (filter.type === 'or') {
        mainTableFilters.push(filter)
        continue
      }

      if (filter.column.includes('.')) {
        const [joinTable, col] = filter.column.split('.', 2)
        if (!joinTableFilters.has(joinTable)) {
          joinTableFilters.set(joinTable, [])
        }
        joinTableFilters.get(joinTable)!.push({ ...filter, column: col })
        continue
      }

      mainTableFilters.push(filter)
    }

    const conditions: string[] = []

    for (const filter of mainTableFilters) {
      conditions.push(this.filterToSQL(filter))
    }

    if (joinTableFilters.size > 0) {
      for (const [joinTable, filters] of Array.from(joinTableFilters.entries())) {
        const joinSpec = this.joinSpecs.find(j => j.table === joinTable)
        const fk = inferForeignKey(this.tableName, joinTable)

        const subConditions = filters.map(f => this.filterToSQL(f, joinTable))

        if (fk.on === 'main') {
          const subQuery = `SELECT "id" FROM "${joinTable}" WHERE ${subConditions.join(' AND ')}`
          conditions.push(`"${fk.column}" IN (${subQuery})`)
        } else {
          const mainSingular = singularize(this.tableName)
          const subQuery = `SELECT "${fk.column}" FROM "${joinTable}" WHERE ${subConditions.join(' AND ')}`
          conditions.push(`"id" IN (${subQuery})`)
        }

        if (joinSpec?.isInner) {
          if (fk.on === 'main') {
            conditions.push(`"${fk.column}" IS NOT NULL`)
            const existsQuery = `EXISTS (SELECT 1 FROM "${joinTable}" WHERE "${joinTable}"."id" = "${this.tableName}"."${fk.column}")`
            conditions.push(existsQuery)
          } else {
            const existsQuery = `EXISTS (SELECT 1 FROM "${joinTable}" WHERE "${joinTable}"."${fk.column}" = "${this.tableName}"."id")`
            conditions.push(existsQuery)
          }
        }
      }
    }

    for (const joinSpec of this.joinSpecs) {
      if (joinSpec.isInner && !joinTableFilters.has(joinSpec.table)) {
        const fk = inferForeignKey(this.tableName, joinSpec.table)
        if (fk.on === 'main') {
          conditions.push(`"${fk.column}" IS NOT NULL`)
          conditions.push(`EXISTS (SELECT 1 FROM "${joinSpec.table}" WHERE "${joinSpec.table}"."id" = "${this.tableName}"."${fk.column}")`)
        } else {
          conditions.push(`EXISTS (SELECT 1 FROM "${joinSpec.table}" WHERE "${joinSpec.table}"."${fk.column}" = "${this.tableName}"."id")`)
        }
      }
    }

    if (conditions.length === 0) return ''
    return ' WHERE ' + conditions.join(' AND ')
  }

  private filterToSQL(filter: Filter, tablePrefix?: string): string {
    const col = tablePrefix ? `"${tablePrefix}"."${filter.column}"` : escapeIdentifier(filter.column)

    switch (filter.type) {
      case 'eq':
        return `${col} = ${formatValue(filter.value)}`
      case 'neq':
        return `${col} != ${formatValue(filter.value)}`
      case 'gt':
        return `${col} > ${formatValue(filter.value)}`
      case 'gte':
        return `${col} >= ${formatValue(filter.value)}`
      case 'lt':
        return `${col} < ${formatValue(filter.value)}`
      case 'lte':
        return `${col} <= ${formatValue(filter.value)}`
      case 'is':
        if (filter.value === null) return `${col} IS NULL`
        if (filter.value === true) return `${col} IS TRUE`
        if (filter.value === false) return `${col} IS FALSE`
        return `${col} IS NULL`
      case 'in': {
        const vals = (filter.value as any[]).map(v => formatValue(v)).join(', ')
        return `${col} IN (${vals})`
      }
      case 'ilike':
        return `${col} ILIKE ${escapeLiteral(filter.value)}`
      case 'or':
        return parseOrFilter(filter.value)
      default:
        return `${col} = ${formatValue(filter.value)}`
    }
  }

  private buildOrderClause(): string {
    if (this.orderClauses.length === 0) return ''
    const parts = this.orderClauses.map(o => {
      const dir = o.ascending ? 'ASC' : 'DESC'
      const nulls = o.nullsFirst ? 'NULLS FIRST' : 'NULLS LAST'
      return `${escapeIdentifier(o.column)} ${dir} ${nulls}`
    })
    return ' ORDER BY ' + parts.join(', ')
  }

  private buildLimitOffset(): string {
    let clause = ''
    if (this.limitVal !== null) clause += ` LIMIT ${this.limitVal}`
    if (this.offsetVal !== null) clause += ` OFFSET ${this.offsetVal}`
    return clause
  }

  then(resolve: (value: any) => void, reject?: (reason: any) => void) {
    this.execute().then(resolve, reject)
  }

  async execute(): Promise<QueryResult> {
    try {
      if (this._isInsert) return await this.executeInsert()
      if (this._isUpdate) return await this.executeUpdate()
      if (this._isDelete) return await this.executeDelete()
      if (this._isUpsert) return await this.executeUpsert()
      return await this.executeSelect()
    } catch (err: any) {
      return { data: null, error: { message: err.message || String(err) } }
    }
  }

  private async executeSelect(): Promise<QueryResult> {
    const colsSQL = buildColumnsSQL(this._mainColumns)
    const where = this.buildWhereClause()
    const order = this.buildOrderClause()
    const limitOffset = this.buildLimitOffset()

    let count: number | undefined

    if (this.countMode === 'exact') {
      const countQuery = `SELECT COUNT(*) as count FROM "${this.tableName}"${where}`
      const countResult = await sql.unsafe(countQuery)
      count = parseInt(countResult[0]?.count || '0', 10)

      if (this.headOnly) {
        return { data: null, error: null, count }
      }
    }

    const query = `SELECT ${colsSQL} FROM "${this.tableName}"${where}${order}${limitOffset}`
    let rows = await sql.unsafe(query)
    let data: any = Array.from(rows)

    if (this.joinSpecs.length > 0 && data.length > 0) {
      data = await this.attachJoinData(data)
    }

    if (this._isSingle) {
      if (data.length === 0) {
        return { data: null, error: { message: 'No rows found' }, ...(count !== undefined ? { count } : {}) }
      }
      data = data[0]
    } else if (this._isMaybeSingle) {
      data = data.length > 0 ? data[0] : null
    }

    const result: QueryResult = { data, error: null }
    if (count !== undefined) result.count = count
    return result
  }

  private async attachJoinData(rows: any[]): Promise<any[]> {
    for (const joinSpec of this.joinSpecs) {
      const fk = inferForeignKey(this.tableName, joinSpec.table)
      const joinCols = joinSpec.columns === '*' ? '*' : joinSpec.columns.split(',').map(c => escapeIdentifier(c.trim())).join(', ')

      if (fk.on === 'main') {
        const ids = Array.from(new Set(rows.map(r => r[fk.column]).filter(id => id != null)))
        if (ids.length === 0) {
          rows = rows.map(r => ({ ...r, [joinSpec.table]: null }))
          continue
        }

        const idList = ids.map(id => formatValue(id)).join(', ')
        const joinQuery = `SELECT ${joinCols} FROM "${joinSpec.table}" WHERE "id" IN (${idList})`
        const joinRows = await sql.unsafe(joinQuery)
        const joinMap = new Map<string, any>()
        for (const jr of joinRows) {
          joinMap.set(String(jr.id), jr)
        }

        rows = rows.map(r => ({
          ...r,
          [joinSpec.table]: r[fk.column] ? (joinMap.get(String(r[fk.column])) || null) : null,
        }))
      } else {
        const ids = Array.from(new Set(rows.map(r => r.id).filter(id => id != null)))
        if (ids.length === 0) {
          rows = rows.map(r => ({ ...r, [joinSpec.table]: null }))
          continue
        }

        const idList = ids.map(id => formatValue(id)).join(', ')
        const joinQuery = `SELECT ${joinCols} FROM "${joinSpec.table}" WHERE "${fk.column}" IN (${idList})`
        const joinRows = await sql.unsafe(joinQuery)

        const joinMap = new Map<string, any[]>()
        for (const jr of joinRows) {
          const key = String(jr[fk.column])
          if (!joinMap.has(key)) joinMap.set(key, [])
          joinMap.get(key)!.push(jr)
        }

        rows = rows.map(r => {
          const related = joinMap.get(String(r.id)) || []
          return {
            ...r,
            [joinSpec.table]: related.length === 1 ? related[0] : (related.length === 0 ? null : related),
          }
        })
      }
    }

    return rows
  }

  private async executeInsert(): Promise<QueryResult> {
    const records = Array.isArray(this.insertData) ? this.insertData : [this.insertData]
    const allKeys = Array.from(new Set(records.flatMap((r: any) => Object.keys(r))))
    const columns = allKeys.map(k => escapeIdentifier(k)).join(', ')
    const valueRows = records.map((record: any) => {
      const vals = allKeys.map(k => formatValue(record[k]))
      return `(${vals.join(', ')})`
    })

    let query = `INSERT INTO "${this.tableName}" (${columns}) VALUES ${valueRows.join(', ')}`

    if (this._shouldSelect) {
      query += ' RETURNING *'
    }

    const result = await sql.unsafe(query)

    if (!this._shouldSelect) {
      return { data: null, error: null }
    }

    let data: any = Array.from(result)

    if (this._isSingle) {
      data = data.length > 0 ? data[0] : null
    } else if (this._isMaybeSingle) {
      data = data.length > 0 ? data[0] : null
    }

    return { data, error: null }
  }

  private async executeUpdate(): Promise<QueryResult> {
    const setClauses = Object.entries(this.updateData)
      .map(([key, value]) => `${escapeIdentifier(key)} = ${formatValue(value)}`)
      .join(', ')

    const where = this.buildWhereClause()
    const query = `UPDATE "${this.tableName}" SET ${setClauses}${where} RETURNING *`

    const result = await sql.unsafe(query)
    let data: any = Array.from(result)

    if (this._isSingle) {
      data = data.length > 0 ? data[0] : null
    } else if (this._isMaybeSingle) {
      data = data.length > 0 ? data[0] : null
    }

    return { data, error: null }
  }

  private async executeDelete(): Promise<QueryResult> {
    const where = this.buildWhereClause()
    const query = `DELETE FROM "${this.tableName}"${where}`

    await sql.unsafe(query)
    return { data: null, error: null }
  }

  private async executeUpsert(): Promise<QueryResult> {
    const records = Array.isArray(this.insertData) ? this.insertData : [this.insertData]
    const allKeys = Array.from(new Set(records.flatMap((r: any) => Object.keys(r))))
    const columns = allKeys.map(k => escapeIdentifier(k)).join(', ')
    const valueRows = records.map((record: any) => {
      const vals = allKeys.map(k => formatValue(record[k]))
      return `(${vals.join(', ')})`
    })

    const conflictCol = this.upsertConflict || 'id'
    const updateCols = allKeys
      .filter(k => k !== conflictCol)
      .map(k => `${escapeIdentifier(k)} = EXCLUDED.${escapeIdentifier(k)}`)
      .join(', ')

    let query = `INSERT INTO "${this.tableName}" (${columns}) VALUES ${valueRows.join(', ')} ON CONFLICT (${escapeIdentifier(conflictCol)})`

    if (updateCols) {
      query += ` DO UPDATE SET ${updateCols}`
    } else {
      query += ' DO NOTHING'
    }

    query += ' RETURNING *'

    const result = await sql.unsafe(query)
    let data: any = Array.from(result)

    if (this._isSingle) {
      data = data.length > 0 ? data[0] : null
    } else if (this._isMaybeSingle) {
      data = data.length > 0 ? data[0] : null
    }

    return { data, error: null }
  }
}

export const db = {
  from(table: string): QueryBuilder {
    return new QueryBuilder(table)
  },
}
