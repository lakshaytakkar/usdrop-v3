import sql from './db';

const IDENTIFIER_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
function assertIdentifier(name: string): string {
  if (!IDENTIFIER_RE.test(name)) {
    throw new Error(`Invalid SQL identifier: ${name}`);
  }
  return name;
}

type FilterOp = { type: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ilike' | 'is'; col: string; val: any }
  | { type: 'in'; col: string; val: any[] }
  | { type: 'or'; expr: string };

interface QueryOptions {
  count?: 'exact';
  head?: boolean;
}

function parseSelectColumns(selectStr: string): { cols: string[]; joins: { table: string; alias?: string; cols: string }[] } {
  const cols: string[] = [];
  const joins: { table: string; alias?: string; cols: string }[] = [];

  let depth = 0;
  let current = '';
  const parts: string[] = [];
  for (const ch of selectStr) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());

  for (const part of parts) {
    const joinMatch = part.match(/^(\w+)(?:!(\w+))?\s*\(([^)]*)\)$/);
    if (joinMatch) {
      joins.push({ table: joinMatch[1], alias: joinMatch[2] || undefined, cols: joinMatch[3] });
    } else {
      cols.push(part.trim());
    }
  }

  return { cols, joins };
}

function buildOrClause(expr: string, table: string): string {
  const conditions: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of expr) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      conditions.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) conditions.push(current.trim());

  return conditions.map(cond => {
    const eqMatch = cond.match(/^(\w+)\.eq\.(.+)$/);
    if (eqMatch) {
      const val = eqMatch[2];
      if (val === 'true') return `"${table}"."${eqMatch[1]}" = true`;
      if (val === 'false') return `"${table}"."${eqMatch[1]}" = false`;
      if (val === 'null') return `"${table}"."${eqMatch[1]}" IS NULL`;
      if (/^\d+$/.test(val)) return `"${table}"."${eqMatch[1]}" = ${val}`;
      return `"${table}"."${eqMatch[1]}" = '${val.replace(/'/g, "''")}'`;
    }
    const neqMatch = cond.match(/^(\w+)\.neq\.(.+)$/);
    if (neqMatch) {
      const val = neqMatch[2];
      return `"${table}"."${neqMatch[1]}" != '${val.replace(/'/g, "''")}'`;
    }
    const isMatch = cond.match(/^(\w+)\.is\.(null|true|false)$/);
    if (isMatch) {
      if (isMatch[2] === 'null') return `"${table}"."${isMatch[1]}" IS NULL`;
      return `"${table}"."${isMatch[1]}" = ${isMatch[2]}`;
    }
    const ilikeMatch = cond.match(/^(\w+)\.ilike\.(.+)$/);
    if (ilikeMatch) {
      return `"${table}"."${ilikeMatch[1]}" ILIKE '${ilikeMatch[2].replace(/'/g, "''")}'`;
    }
    return cond;
  }).join(' OR ');
}

function escapeVal(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

class QueryBuilder {
  private tableName: string;
  private op: 'select' | 'insert' | 'update' | 'delete' | 'upsert' = 'select';
  private selectCols: string = '*';
  private selectOptions: QueryOptions = {};
  private filters: FilterOp[] = [];
  private orderClauses: { col: string; asc: boolean }[] = [];
  private limitVal: number | null = null;
  private rangeFrom: number | null = null;
  private rangeTo: number | null = null;
  private singleMode: boolean = false;
  private maybeSingleMode: boolean = false;
  private insertData: any = null;
  private updateData: any = null;
  private upsertConflict: string | null = null;
  private returnSelect: string | null = null;

  constructor(table: string) {
    this.tableName = assertIdentifier(table);
  }

  select(cols: string = '*', opts?: QueryOptions): QueryBuilder {
    this.op = 'select';
    this.selectCols = cols;
    if (opts) this.selectOptions = opts;
    return this;
  }

  insert(data: any | any[]): QueryBuilder {
    this.op = 'insert';
    this.insertData = data;
    return this;
  }

  update(data: any): QueryBuilder {
    this.op = 'update';
    this.updateData = data;
    return this;
  }

  delete(): QueryBuilder {
    this.op = 'delete';
    return this;
  }

  upsert(data: any | any[], opts?: { onConflict?: string }): QueryBuilder {
    this.op = 'upsert';
    this.insertData = data;
    this.upsertConflict = opts?.onConflict || null;
    return this;
  }

  eq(col: string, val: any): QueryBuilder {
    this.filters.push({ type: 'eq', col: assertIdentifier(col), val });
    return this;
  }

  neq(col: string, val: any): QueryBuilder {
    this.filters.push({ type: 'neq', col: assertIdentifier(col), val });
    return this;
  }

  gt(col: string, val: any): QueryBuilder {
    this.filters.push({ type: 'gt', col: assertIdentifier(col), val });
    return this;
  }

  gte(col: string, val: any): QueryBuilder {
    this.filters.push({ type: 'gte', col: assertIdentifier(col), val });
    return this;
  }

  lt(col: string, val: any): QueryBuilder {
    this.filters.push({ type: 'lt', col: assertIdentifier(col), val });
    return this;
  }

  lte(col: string, val: any): QueryBuilder {
    this.filters.push({ type: 'lte', col: assertIdentifier(col), val });
    return this;
  }

  ilike(col: string, val: string): QueryBuilder {
    this.filters.push({ type: 'ilike', col: assertIdentifier(col), val });
    return this;
  }

  is(col: string, val: any): QueryBuilder {
    this.filters.push({ type: 'is', col: assertIdentifier(col), val });
    return this;
  }

  in(col: string, vals: any[]): QueryBuilder {
    this.filters.push({ type: 'in', col: assertIdentifier(col), val: vals });
    return this;
  }

  or(expr: string): QueryBuilder {
    this.filters.push({ type: 'or', expr });
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }): QueryBuilder {
    this.orderClauses.push({ col: assertIdentifier(col), asc: opts?.ascending !== false });
    return this;
  }

  limit(n: number): QueryBuilder {
    this.limitVal = n;
    return this;
  }

  range(from: number, to: number): QueryBuilder {
    this.rangeFrom = from;
    this.rangeTo = to;
    return this;
  }

  single(): Promise<{ data: any; error: any; count?: number }> {
    this.singleMode = true;
    return this.execute();
  }

  maybeSingle(): Promise<{ data: any; error: any; count?: number }> {
    this.maybeSingleMode = true;
    return this.execute();
  }

  then(resolve: (val: { data: any; error: any; count?: number }) => void, reject?: (err: any) => void): void {
    this.execute().then(resolve, reject);
  }

  private buildWhereClause(): string {
    if (this.filters.length === 0) return '';
    const clauses = this.filters.map(f => {
      if (f.type === 'or') {
        return `(${buildOrClause((f as any).expr, this.tableName)})`;
      }
      const col = `"${this.tableName}"."${f.col}"`;
      switch (f.type) {
        case 'eq': return `${col} = ${escapeVal(f.val)}`;
        case 'neq': return `${col} != ${escapeVal(f.val)}`;
        case 'gt': return `${col} > ${escapeVal(f.val)}`;
        case 'gte': return `${col} >= ${escapeVal(f.val)}`;
        case 'lt': return `${col} < ${escapeVal(f.val)}`;
        case 'lte': return `${col} <= ${escapeVal(f.val)}`;
        case 'ilike': return `${col} ILIKE ${escapeVal(f.val)}`;
        case 'is': return f.val === null ? `${col} IS NULL` : `${col} IS ${f.val}`;
        case 'in': {
          const vals = (f as any).val as any[];
          if (vals.length === 0) return 'false';
          return `${col} IN (${vals.map(v => escapeVal(v)).join(', ')})`;
        }
        default: return 'true';
      }
    });
    return ' WHERE ' + clauses.join(' AND ');
  }

  private buildOrderClause(): string {
    if (this.orderClauses.length === 0) return '';
    return ' ORDER BY ' + this.orderClauses.map(o => `"${this.tableName}"."${o.col}" ${o.asc ? 'ASC' : 'DESC'}`).join(', ');
  }

  private buildLimitOffset(): string {
    let s = '';
    if (this.rangeFrom !== null && this.rangeTo !== null) {
      s += ` LIMIT ${this.rangeTo - this.rangeFrom + 1} OFFSET ${this.rangeFrom}`;
    } else if (this.limitVal !== null) {
      s += ` LIMIT ${this.limitVal}`;
    }
    return s;
  }

  private async execute(): Promise<{ data: any; error: any; count?: number }> {
    try {
      switch (this.op) {
        case 'select': return await this.executeSelect();
        case 'insert': return await this.executeInsert();
        case 'update': return await this.executeUpdate();
        case 'delete': return await this.executeDelete();
        case 'upsert': return await this.executeUpsert();
        default: return { data: null, error: { message: 'Unknown operation' } };
      }
    } catch (err: any) {
      console.error(`DB Error [${this.op} ${this.tableName}]:`, err.message);
      return { data: null, error: { message: err.message } };
    }
  }

  private async executeSelect(): Promise<{ data: any; error: any; count?: number }> {
    const { cols, joins } = parseSelectColumns(this.selectCols);
    const where = this.buildWhereClause();
    const order = this.buildOrderClause();
    const limitOffset = this.buildLimitOffset();

    if (this.selectOptions.head && this.selectOptions.count === 'exact') {
      const countQuery = `SELECT COUNT(*) as count FROM "${this.tableName}"${where}`;
      const result = await sql.unsafe(countQuery);
      return { data: null, error: null, count: parseInt(result[0]?.count || '0') };
    }

    const colStr = cols.includes('*') ? `"${this.tableName}".*` : cols.map(c => {
      if (c.includes('.') || c.includes('(') || c.includes(' as ')) return c;
      return `"${this.tableName}"."${c}"`;
    }).join(', ');

    const query = `SELECT ${colStr} FROM "${this.tableName}"${where}${order}${limitOffset}`;
    let rows = await sql.unsafe(query);

    if (joins.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        for (const join of joins) {
          const joinTable = join.table;
          const fkCol = join.alias || `${this.tableName}_${joinTable.slice(0, -1)}_id_fkey`;
          let fkColumn: string | null = null;
          let reverseFk: string | null = null;

          const fkGuesses = [
            `${joinTable.replace(/s$/, '')}_id`,
            `${joinTable}_id`,
          ];
          for (const guess of fkGuesses) {
            if (rows[i][guess] !== undefined) {
              fkColumn = guess;
              break;
            }
          }

          if (fkColumn && rows[i][fkColumn]) {
            const joinCols = join.cols === '*' ? '*' : join.cols.split(',').map(c => `"${c.trim()}"`).join(', ');
            const joinQuery = `SELECT ${joinCols} FROM "${joinTable}" WHERE "id" = ${escapeVal(rows[i][fkColumn])} LIMIT 1`;
            const joinResult = await sql.unsafe(joinQuery);
            rows[i][joinTable] = joinResult[0] || null;
          } else {
            const reverseFkGuesses = [
              `${this.tableName.replace(/s$/, '')}_id`,
              `${this.tableName}_id`,
              'user_id',
            ];
            for (const guess of reverseFkGuesses) {
              reverseFk = guess;
              try {
                const joinCols = join.cols === '*' ? '*' : join.cols.split(',').map(c => `"${c.trim()}"`).join(', ');
                const joinQuery = `SELECT ${joinCols} FROM "${joinTable}" WHERE "${guess}" = ${escapeVal(rows[i].id)}`;
                const joinResult = await sql.unsafe(joinQuery);
                rows[i][joinTable] = joinResult.length === 1 ? joinResult[0] : joinResult;
                break;
              } catch {
                continue;
              }
            }
            if (rows[i][joinTable] === undefined) {
              rows[i][joinTable] = null;
            }
          }
        }
      }
    }

    if (this.singleMode) {
      if (rows.length === 0) return { data: null, error: { message: 'Row not found', code: 'PGRST116' } };
      return { data: rows[0], error: null };
    }
    if (this.maybeSingleMode) {
      return { data: rows[0] || null, error: null };
    }

    const result: any = { data: rows, error: null };
    if (this.selectOptions.count === 'exact') {
      const countQuery = `SELECT COUNT(*) as count FROM "${this.tableName}"${where}`;
      const countResult = await sql.unsafe(countQuery);
      result.count = parseInt(countResult[0]?.count || '0');
    }
    return result;
  }

  private async executeInsert(): Promise<{ data: any; error: any }> {
    const rows = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
    if (rows.length === 0) return { data: [], error: null };

    const allKeys = [...new Set(rows.flatMap(r => Object.keys(r)))];
    const colNames = allKeys.map(k => `"${k}"`).join(', ');
    const valueRows = rows.map(row =>
      `(${allKeys.map(k => escapeVal(row[k] !== undefined ? row[k] : null)).join(', ')})`
    ).join(', ');

    const query = `INSERT INTO "${this.tableName}" (${colNames}) VALUES ${valueRows} RETURNING *`;
    const result = await sql.unsafe(query);

    if (this.singleMode) {
      return { data: result[0] || null, error: null };
    }
    return { data: Array.isArray(this.insertData) ? result : result[0] || null, error: null };
  }

  private async executeUpdate(): Promise<{ data: any; error: any }> {
    const setClauses = Object.entries(this.updateData)
      .map(([k, v]) => `"${k}" = ${escapeVal(v)}`)
      .join(', ');
    const where = this.buildWhereClause();
    const query = `UPDATE "${this.tableName}" SET ${setClauses}${where} RETURNING *`;
    const result = await sql.unsafe(query);

    if (this.singleMode) {
      return { data: result[0] || null, error: null };
    }
    return { data: result, error: null };
  }

  private async executeDelete(): Promise<{ data: any; error: any }> {
    const where = this.buildWhereClause();
    const query = `DELETE FROM "${this.tableName}"${where} RETURNING *`;
    const result = await sql.unsafe(query);
    return { data: result, error: null };
  }

  private async executeUpsert(): Promise<{ data: any; error: any }> {
    const rows = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
    if (rows.length === 0) return { data: [], error: null };

    const allKeys = [...new Set(rows.flatMap(r => Object.keys(r)))];
    const colNames = allKeys.map(k => `"${k}"`).join(', ');
    const valueRows = rows.map(row =>
      `(${allKeys.map(k => escapeVal(row[k] !== undefined ? row[k] : null)).join(', ')})`
    ).join(', ');

    const conflictCol = this.upsertConflict || 'id';
    const updateCols = allKeys.filter(k => k !== conflictCol)
      .map(k => `"${k}" = EXCLUDED."${k}"`)
      .join(', ');

    const query = `INSERT INTO "${this.tableName}" (${colNames}) VALUES ${valueRows} ON CONFLICT ("${conflictCol}") DO UPDATE SET ${updateCols} RETURNING *`;
    const result = await sql.unsafe(query);

    if (this.singleMode) {
      return { data: result[0] || null, error: null };
    }
    return { data: Array.isArray(this.insertData) ? result : result[0] || null, error: null };
  }
}

const supabaseAdmin = {
  from(table: string): QueryBuilder {
    return new QueryBuilder(table);
  },
  auth: {
    async resetPasswordForEmail(_email: string) {
      return { data: null, error: null };
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const bcrypt = await import('bcryptjs');
      const result = await sql`SELECT "id", "password_hash" FROM "profiles" WHERE "email" = ${email}`;
      if (!result[0] || !result[0].password_hash) {
        return { data: null, error: { message: 'Invalid login credentials' } };
      }
      const valid = await bcrypt.compare(password, result[0].password_hash);
      if (!valid) {
        return { data: null, error: { message: 'Invalid login credentials' } };
      }
      return { data: { user: { id: result[0].id } }, error: null };
    },
    admin: {
      async createUser({ email, password, email_confirm, user_metadata }: any) {
        const bcrypt = await import('bcryptjs');
        const hash = await bcrypt.hash(password, 10);
        try {
          const fullName = user_metadata?.full_name || null;
          const result = await sql`
            INSERT INTO "profiles" ("email", "password_hash", "full_name", "status")
            VALUES (${email}, ${hash}, ${fullName}, 'active')
            RETURNING "id", "email"`;
          return { data: { user: { id: result[0].id, email: result[0].email } }, error: null };
        } catch (err: any) {
          return { data: null, error: { message: err.message } };
        }
      },
      async updateUserById(id: string, updates: any) {
        try {
          if (updates.password && updates.email) {
            const bcrypt = await import('bcryptjs');
            const hash = await bcrypt.hash(updates.password, 10);
            await sql`UPDATE "profiles" SET "password_hash" = ${hash}, "email" = ${updates.email} WHERE "id" = ${id}`;
          } else if (updates.password) {
            const bcrypt = await import('bcryptjs');
            const hash = await bcrypt.hash(updates.password, 10);
            await sql`UPDATE "profiles" SET "password_hash" = ${hash} WHERE "id" = ${id}`;
          } else if (updates.email) {
            await sql`UPDATE "profiles" SET "email" = ${updates.email} WHERE "id" = ${id}`;
          }
          return { error: null };
        } catch (err: any) {
          return { error: { message: err.message } };
        }
      },
      async deleteUser(id: string) {
        try {
          await sql`DELETE FROM "profiles" WHERE "id" = ${id}`;
          return { error: null };
        } catch (err: any) {
          return { error: { message: err.message } };
        }
      },
    },
  },
};

function createSupabaseClientForUser(_accessToken: string) {
  return {
    auth: {
      async getUser() {
        return { data: { user: null }, error: { message: 'Use local auth instead' } };
      },
      async updateUser(_updates: any) {
        return { error: { message: 'Use local auth instead' } };
      },
      async signOut() {
        return { error: null };
      },
    },
    from(table: string): QueryBuilder {
      return new QueryBuilder(table);
    },
  };
}

export { supabaseAdmin, createSupabaseClientForUser };
