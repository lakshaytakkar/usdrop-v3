import { pool } from "./db";

type SupabaseResult = { data: any; error: any; count?: number | null };

interface SelectOptions {
  count?: "exact";
  head?: boolean;
}

interface UpsertOptions {
  onConflict?: string;
}

interface OrderOptions {
  ascending?: boolean;
  nullsFirst?: boolean;
}

interface JoinDef {
  alias: string;
  table: string;
  columns: string[];
  fkColumn: string;
  joinType: string;
  nestedJoins?: JoinDef[];
}

function parseSelectString(
  tableName: string,
  selectStr: string
): { columns: string[]; joins: JoinDef[] } {
  const str = selectStr.replace(/\s+/g, " ").trim();
  const columns: string[] = [];
  const joins: JoinDef[] = [];

  let depth = 0;
  let current = "";
  const parts: string[] = [];

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());

  for (const part of parts) {
    const joinMatch = part.match(
      /^(?:(\w+):)?(\w+)(?:!(\w+))?(?:!(left|inner))?\((.+)\)$/
    );
    if (!joinMatch) {
      const joinMatch2 = part.match(
        /^(?:(\w+):)?(\w+)(?:!(left|inner))?(?:!(\w+))?\((.+)\)$/
      );
      if (joinMatch2) {
        const [, alias, joinTable, joinType, fkHint, innerSelect] = joinMatch2;
        const join = resolveJoin(
          tableName,
          alias || joinTable,
          joinTable,
          fkHint || null,
          joinType || "left",
          innerSelect
        );
        joins.push(join);
        continue;
      }
      columns.push(part.trim());
    } else {
      const [, alias, joinTable, fkHint, joinType, innerSelect] = joinMatch;
      const join = resolveJoin(
        tableName,
        alias || joinTable,
        joinTable,
        fkHint || null,
        joinType || "left",
        innerSelect
      );
      joins.push(join);
    }
  }

  return { columns, joins };
}

function resolveJoin(
  parentTable: string,
  alias: string,
  joinTable: string,
  fkHint: string | null,
  joinType: string,
  innerSelect: string
): JoinDef {
  let fkColumn = "";

  if (fkHint) {
    if (fkHint.endsWith("_fkey")) {
      const prefix = parentTable + "_";
      if (fkHint.startsWith(prefix)) {
        fkColumn = fkHint.slice(prefix.length, -5);
      } else {
        fkColumn = fkHint.slice(0, -5);
      }
    } else if (fkHint === "left" || fkHint === "inner") {
      fkColumn = guessFK(parentTable, joinTable);
    } else {
      fkColumn = fkHint;
    }
  } else {
    fkColumn = guessFK(parentTable, joinTable);
  }

  const innerParsed = parseSelectString(joinTable, innerSelect);
  const nestedJoins =
    innerParsed.joins.length > 0 ? innerParsed.joins : undefined;

  return {
    alias,
    table: joinTable,
    columns: innerParsed.columns,
    fkColumn,
    joinType,
    nestedJoins,
  };
}

function guessFK(parentTable: string, joinTable: string): string {
  const singularize = (t: string) => {
    if (t.endsWith("ies")) return t.slice(0, -3) + "y";
    if (t.endsWith("ses")) return t.slice(0, -2);
    if (t.endsWith("s")) return t.slice(0, -1);
    return t;
  };

  const fkMappings: Record<string, Record<string, string>> = {
    profiles: { subscription_plans: "subscription_plan_id" },
    products: {
      categories: "category_id",
      suppliers: "supplier_id",
    },
    competitor_stores: { categories: "category_id" },
    competitor_store_products: {
      competitor_stores: "competitor_store_id",
      products: "product_id",
    },
    courses: { profiles: "instructor_id" },
    course_modules: { courses: "course_id" },
    course_chapters: { course_modules: "module_id" },
    course_enrollments: { courses: "course_id", profiles: "user_id" },
    chapter_completions: {
      course_enrollments: "enrollment_id",
      course_chapters: "chapter_id",
    },
    module_completions: {
      course_enrollments: "enrollment_id",
      course_modules: "module_id",
    },
    course_notes: { profiles: "user_id", course_modules: "module_id" },
    quiz_attempts: {
      course_enrollments: "enrollment_id",
      course_chapters: "chapter_id",
    },
    onboarding_videos: { onboarding_modules: "module_id" },
    onboarding_progress: {
      profiles: "user_id",
      onboarding_videos: "video_id",
      onboarding_modules: "module_id",
    },
    dev_tasks: { profiles: "created_by" },
    dev_task_attachments: { dev_tasks: "task_id", profiles: "uploaded_by" },
    dev_task_comments: { dev_tasks: "task_id", profiles: "user_id" },
    dev_task_history: { dev_tasks: "task_id", profiles: "changed_by" },
    user_picklist: { profiles: "user_id", products: "product_id" },
    user_details: { profiles: "user_id" },
    user_credentials: { profiles: "user_id" },
    shopify_stores: { profiles: "user_id" },
    roadmap_progress: { profiles: "user_id" },
    product_metadata: { products: "product_id" },
    product_source: { products: "product_id" },
    product_research: { products: "product_id" },
    support_tickets: { profiles: "user_id" },
    ticket_messages: { support_tickets: "ticket_id", profiles: "user_id" },
    batch_members: { batches: "batch_id", profiles: "user_id" },
    user_admin_notes: { profiles: "admin_id" },
    lead_scores: { profiles: "user_id" },
    mentorship_leads: { profiles: "user_id" },
    payment_links: { profiles: "user_id" },
    cro_checklist_state: { profiles: "user_id" },
    user_module_overrides: { profiles: "user_id" },
    user_apps: { profiles: "user_id" },
    user_activity_log: { profiles: "user_id" },
    user_content_access: { profiles: "user_id" },
    learning_progress: { profiles: "user_id" },
    user_lesson_progress: { profiles: "user_id" },
    llc_applications: { profiles: "user_id" },
    access_rules: { profiles: "user_id" },
    croItems: { cro_categories: "category_id" },
    roadmap_tasks: { roadmap_stages: "stage_id" },
    ad_videos: { profiles: "user_id" },
    rnd_entries: { profiles: "user_id" },
    user_rnd_entries: { profiles: "user_id" },
  };

  const mapping = fkMappings[parentTable];
  if (mapping && mapping[joinTable]) {
    return mapping[joinTable];
  }

  return singularize(joinTable) + "_id";
}

type Condition = {
  type: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "is" | "ilike" | "like" | "or" | "not";
  column?: string;
  value?: any;
  expression?: string;
};

class QueryBuilder {
  private _table: string;
  private _operation: "select" | "insert" | "update" | "delete" | "upsert" =
    "select";
  private _selectStr: string = "*";
  private _selectOptions: SelectOptions = {};
  private _conditions: Condition[] = [];
  private _orderClauses: { column: string; ascending: boolean; nullsFirst: boolean }[] = [];
  private _limitCount: number | null = null;
  private _rangeFrom: number | null = null;
  private _rangeTo: number | null = null;
  private _insertData: any = null;
  private _updateData: any = null;
  private _upsertOptions: UpsertOptions = {};
  private _returnSingle: boolean = false;
  private _returnMaybeSingle: boolean = false;
  private _returnSelect: boolean = false;
  private _returnSelectStr: string = "*";

  constructor(table: string) {
    this._table = table;
  }

  select(columns?: string, options?: SelectOptions): this {
    if (this._operation === "select" || !this._operation) {
      this._operation = "select";
    } else {
      this._returnSelect = true;
    }
    if (columns) {
      this._selectStr = columns;
      this._returnSelectStr = columns;
    }
    if (options) this._selectOptions = options;
    return this;
  }

  insert(data: any): this {
    this._operation = "insert";
    this._insertData = data;
    return this;
  }

  update(data: any): this {
    this._operation = "update";
    this._updateData = data;
    return this;
  }

  delete(): this {
    this._operation = "delete";
    return this;
  }

  upsert(data: any, options?: UpsertOptions): this {
    this._operation = "upsert";
    this._insertData = data;
    if (options) this._upsertOptions = options;
    return this;
  }

  eq(column: string, value: any): this {
    this._conditions.push({ type: "eq", column, value });
    return this;
  }

  neq(column: string, value: any): this {
    this._conditions.push({ type: "neq", column, value });
    return this;
  }

  gt(column: string, value: any): this {
    this._conditions.push({ type: "gt", column, value });
    return this;
  }

  gte(column: string, value: any): this {
    this._conditions.push({ type: "gte", column, value });
    return this;
  }

  lt(column: string, value: any): this {
    this._conditions.push({ type: "lt", column, value });
    return this;
  }

  lte(column: string, value: any): this {
    this._conditions.push({ type: "lte", column, value });
    return this;
  }

  in(column: string, values: any[]): this {
    this._conditions.push({ type: "in", column, value: values });
    return this;
  }

  is(column: string, value: any): this {
    this._conditions.push({ type: "is", column, value });
    return this;
  }

  ilike(column: string, value: string): this {
    this._conditions.push({ type: "ilike", column, value });
    return this;
  }

  like(column: string, value: string): this {
    this._conditions.push({ type: "like", column, value });
    return this;
  }

  not(column: string, operator: string, value: any): this {
    this._conditions.push({ type: "not", column, value: { operator, value } });
    return this;
  }

  or(filterStr: string): this {
    this._conditions.push({ type: "or", expression: filterStr });
    return this;
  }

  order(column: string, options?: OrderOptions): this {
    this._orderClauses.push({
      column,
      ascending: options?.ascending ?? true,
      nullsFirst: options?.nullsFirst ?? false,
    });
    return this;
  }

  limit(count: number): this {
    this._limitCount = count;
    return this;
  }

  range(from: number, to: number): this {
    this._rangeFrom = from;
    this._rangeTo = to;
    return this;
  }

  single(): this {
    this._returnSingle = true;
    return this;
  }

  maybeSingle(): this {
    this._returnMaybeSingle = true;
    return this;
  }

  then(resolve: (value: SupabaseResult) => any, reject?: (reason: any) => any): Promise<any> {
    return this._execute().then(resolve, reject);
  }

  catch(reject: (reason: any) => any): Promise<any> {
    return this._execute().catch(reject);
  }

  private async _execute(): Promise<SupabaseResult> {
    try {
      switch (this._operation) {
        case "select":
          return await this._execSelect();
        case "insert":
          return await this._execInsert();
        case "update":
          return await this._execUpdate();
        case "delete":
          return await this._execDelete();
        case "upsert":
          return await this._execUpsert();
        default:
          return { data: null, error: { message: "Unknown operation" } };
      }
    } catch (err: any) {
      return { data: null, error: { message: err.message, details: err } };
    }
  }

  private _buildWhere(params: any[], startIdx: number = 1): { sql: string; params: any[] } {
    if (this._conditions.length === 0) return { sql: "", params: [] };

    const clauses: string[] = [];
    const values: any[] = [];
    let idx = startIdx;

    for (const cond of this._conditions) {
      switch (cond.type) {
        case "eq":
          clauses.push(`"${cond.column}" = $${idx++}`);
          values.push(cond.value);
          break;
        case "neq":
          clauses.push(`"${cond.column}" != $${idx++}`);
          values.push(cond.value);
          break;
        case "gt":
          clauses.push(`"${cond.column}" > $${idx++}`);
          values.push(cond.value);
          break;
        case "gte":
          clauses.push(`"${cond.column}" >= $${idx++}`);
          values.push(cond.value);
          break;
        case "lt":
          clauses.push(`"${cond.column}" < $${idx++}`);
          values.push(cond.value);
          break;
        case "lte":
          clauses.push(`"${cond.column}" <= $${idx++}`);
          values.push(cond.value);
          break;
        case "in": {
          const placeholders = (cond.value as any[]).map(() => `$${idx++}`).join(", ");
          clauses.push(`"${cond.column}" IN (${placeholders})`);
          values.push(...cond.value);
          break;
        }
        case "is":
          if (cond.value === null) {
            clauses.push(`"${cond.column}" IS NULL`);
          } else if (cond.value === true) {
            clauses.push(`"${cond.column}" IS TRUE`);
          } else if (cond.value === false) {
            clauses.push(`"${cond.column}" IS FALSE`);
          }
          break;
        case "ilike":
          clauses.push(`"${cond.column}" ILIKE $${idx++}`);
          values.push(cond.value);
          break;
        case "like":
          clauses.push(`"${cond.column}" LIKE $${idx++}`);
          values.push(cond.value);
          break;
        case "not": {
          const notVal = cond.value as { operator: string; value: any };
          if (notVal.operator === "eq") {
            clauses.push(`"${cond.column}" != $${idx++}`);
            values.push(notVal.value);
          } else if (notVal.operator === "is") {
            if (notVal.value === null) {
              clauses.push(`"${cond.column}" IS NOT NULL`);
            }
          } else if (notVal.operator === "in") {
            const placeholders2 = (notVal.value as any[]).map(() => `$${idx++}`).join(", ");
            clauses.push(`"${cond.column}" NOT IN (${placeholders2})`);
            values.push(...notVal.value);
          }
          break;
        }
        case "or": {
          const orParsed = this._parseOrFilter(cond.expression!, idx);
          if (orParsed.sql) {
            clauses.push(`(${orParsed.sql})`);
            values.push(...orParsed.params);
            idx += orParsed.params.length;
          }
          break;
        }
      }
    }

    if (clauses.length === 0) return { sql: "", params: [] };
    return { sql: " WHERE " + clauses.join(" AND "), params: values };
  }

  private _parseOrFilter(filterStr: string, startIdx: number): { sql: string; params: any[] } {
    const parts = filterStr.split(",");
    const clauses: string[] = [];
    const params: any[] = [];
    let idx = startIdx;

    for (const part of parts) {
      const trimmed = part.trim();
      const dotParts = trimmed.split(".");
      if (dotParts.length >= 3) {
        const col = dotParts[0];
        const op = dotParts[1];
        const val = dotParts.slice(2).join(".");

        switch (op) {
          case "ilike":
            clauses.push(`"${col}" ILIKE $${idx++}`);
            params.push(val);
            break;
          case "like":
            clauses.push(`"${col}" LIKE $${idx++}`);
            params.push(val);
            break;
          case "eq":
            clauses.push(`"${col}" = $${idx++}`);
            params.push(val);
            break;
          case "neq":
            clauses.push(`"${col}" != $${idx++}`);
            params.push(val);
            break;
          case "gt":
            clauses.push(`"${col}" > $${idx++}`);
            params.push(val);
            break;
          case "gte":
            clauses.push(`"${col}" >= $${idx++}`);
            params.push(val);
            break;
          case "lt":
            clauses.push(`"${col}" < $${idx++}`);
            params.push(val);
            break;
          case "lte":
            clauses.push(`"${col}" <= $${idx++}`);
            params.push(val);
            break;
          case "is":
            if (val === "null") clauses.push(`"${col}" IS NULL`);
            else if (val === "true") clauses.push(`"${col}" IS TRUE`);
            else if (val === "false") clauses.push(`"${col}" IS FALSE`);
            break;
          default:
            clauses.push(`"${col}" = $${idx++}`);
            params.push(val);
        }
      }
    }

    return { sql: clauses.join(" OR "), params };
  }

  private _buildOrderBy(): string {
    if (this._orderClauses.length === 0) return "";
    const parts = this._orderClauses.map((o) => {
      const dir = o.ascending ? "ASC" : "DESC";
      const nulls = o.nullsFirst ? "NULLS FIRST" : "NULLS LAST";
      return `"${o.column}" ${dir} ${nulls}`;
    });
    return " ORDER BY " + parts.join(", ");
  }

  private _buildLimitOffset(): string {
    let sql = "";
    if (this._rangeTo !== null && this._rangeFrom !== null) {
      const limit = this._rangeTo - this._rangeFrom + 1;
      sql += ` LIMIT ${limit} OFFSET ${this._rangeFrom}`;
    } else if (this._limitCount !== null) {
      sql += ` LIMIT ${this._limitCount}`;
    }
    return sql;
  }

  private async _execSelect(): Promise<SupabaseResult> {
    const parsed = parseSelectString(this._table, this._selectStr);
    const { columns, joins } = parsed;

    const isCountOnly = this._selectOptions.head === true;
    const wantCount = this._selectOptions.count === "exact";

    if (isCountOnly && wantCount) {
      const where = this._buildWhere([], 1);
      const countSql = `SELECT COUNT(*) as count FROM "${this._table}"${where.sql}`;
      const result = await pool.query(countSql, where.params);
      const count = parseInt(result.rows[0]?.count || "0", 10);
      return { data: null, error: null, count };
    }

    if (joins.length === 0) {
      const colStr = columns.includes("*")
        ? `"${this._table}".*`
        : columns.map((c) => `"${this._table}"."${c.trim()}"`).join(", ");
      const where = this._buildWhere([], 1);
      let sqlStr = `SELECT ${colStr} FROM "${this._table}"${where.sql}`;
      sqlStr += this._buildOrderBy();
      sqlStr += this._buildLimitOffset();
      const result = await pool.query(sqlStr, where.params);
      let data = result.rows;
      let count: number | null = null;

      if (wantCount) {
        const countWhere = this._buildWhere([], 1);
        const countResult = await pool.query(
          `SELECT COUNT(*) as count FROM "${this._table}"${countWhere.sql}`,
          countWhere.params
        );
        count = parseInt(countResult.rows[0]?.count || "0", 10);
      }

      if (this._returnSingle) {
        if (data.length === 0)
          return {
            data: null,
            error: { message: "Row not found", code: "PGRST116" },
            count,
          };
        return { data: data[0], error: null, count };
      }
      if (this._returnMaybeSingle) {
        return { data: data.length > 0 ? data[0] : null, error: null, count };
      }
      return { data, error: null, count };
    }

    return await this._execSelectWithJoins(columns, joins, wantCount);
  }

  private async _execSelectWithJoins(
    mainColumns: string[],
    joins: JoinDef[],
    wantCount: boolean
  ): Promise<SupabaseResult> {
    const where = this._buildWhere([], 1);
    const mainAlias = "t0";

    const mainColStr = mainColumns.includes("*")
      ? `${mainAlias}.*`
      : mainColumns.map((c) => `${mainAlias}."${c.trim()}"`).join(", ");

    const joinClauses: string[] = [];
    const joinSelects: string[] = [];
    let joinIdx = 1;

    const processJoins = (
      parentAlias: string,
      parentTable: string,
      joinDefs: JoinDef[]
    ) => {
      for (const join of joinDefs) {
        const alias = `j${joinIdx++}`;
        const jType = join.joinType === "inner" ? "INNER JOIN" : "LEFT JOIN";

        const fkCol = join.fkColumn;
        let joinCondition: string;
        if (
          fkCol.endsWith("_id") &&
          fkCol.replace("_id", "") !== singularize(join.table)
        ) {
          joinCondition = `${alias}."id" = ${parentAlias}."${fkCol}"`;
        } else if (fkCol === "user_id" && join.table === "profiles") {
          joinCondition = `${alias}."id" = ${parentAlias}."${fkCol}"`;
        } else {
          joinCondition = `${alias}."id" = ${parentAlias}."${fkCol}"`;
        }

        joinClauses.push(
          `${jType} "${join.table}" ${alias} ON ${joinCondition}`
        );

        const jColStr = join.columns.includes("*")
          ? `row_to_json(${alias}.*)`
          : `json_build_object(${join.columns
              .map((c) => `'${c.trim()}', ${alias}."${c.trim()}"`)
              .join(", ")})`;

        joinSelects.push(`${jColStr} as "${join.alias}"`);

        if (join.nestedJoins) {
          processJoins(alias, join.table, join.nestedJoins);
        }
      }
    };

    processJoins(mainAlias, this._table, joins);

    let sqlStr = `SELECT ${mainColStr}${joinSelects.length > 0 ? ", " + joinSelects.join(", ") : ""} FROM "${this._table}" ${mainAlias} ${joinClauses.join(" ")}`;

    const whereAdapted = where.sql.replace(
      /"(\w+)"/g,
      (match, col) => {
        if (col === this._table) return match;
        return `${mainAlias}."${col}"`;
      }
    );
    sqlStr += whereAdapted;
    sqlStr += this._buildOrderBy()
      .replace(/"(\w+)"/g, (match, col) => {
        return `${mainAlias}."${col}"`;
      });
    sqlStr += this._buildLimitOffset();

    const result = await pool.query(sqlStr, where.params);
    let data = result.rows.map((row) => {
      const cleaned: any = { ...row };
      for (const join of joins) {
        if (cleaned[join.alias]) {
          const jsonVal = cleaned[join.alias];
          if (typeof jsonVal === "string") {
            try {
              cleaned[join.alias] = JSON.parse(jsonVal);
            } catch {
              // keep as-is
            }
          }
          const allNull =
            cleaned[join.alias] &&
            typeof cleaned[join.alias] === "object" &&
            Object.values(cleaned[join.alias]).every((v) => v === null);
          if (allNull) {
            cleaned[join.alias] = null;
          }
        }
      }
      return cleaned;
    });

    let count: number | null = null;
    if (wantCount) {
      const countWhere = this._buildWhere([], 1);
      const countResult = await pool.query(
        `SELECT COUNT(*) as count FROM "${this._table}"${countWhere.sql}`,
        countWhere.params
      );
      count = parseInt(countResult.rows[0]?.count || "0", 10);
    }

    if (this._returnSingle) {
      if (data.length === 0)
        return { data: null, error: { message: "Row not found", code: "PGRST116" }, count };
      return { data: data[0], error: null, count };
    }
    if (this._returnMaybeSingle) {
      return { data: data.length > 0 ? data[0] : null, error: null, count };
    }
    return { data, error: null, count };
  }

  private async _execInsert(): Promise<SupabaseResult> {
    const records = Array.isArray(this._insertData)
      ? this._insertData
      : [this._insertData];

    const allResults: any[] = [];

    for (const record of records) {
      const keys = Object.keys(record).filter((k) => record[k] !== undefined);
      const values = keys.map((k) => record[k]);
      const cols = keys.map((k) => `"${k}"`).join(", ");
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

      const sqlStr = `INSERT INTO "${this._table}" (${cols}) VALUES (${placeholders}) RETURNING *`;
      const result = await pool.query(sqlStr, values);
      allResults.push(...result.rows);
    }

    let data = Array.isArray(this._insertData) ? allResults : allResults;

    if (this._returnSelect || this._returnSingle || this._returnMaybeSingle) {
      if (this._returnSingle || this._returnMaybeSingle) {
        return {
          data: allResults.length > 0 ? allResults[0] : null,
          error: null,
        };
      }
      return { data: allResults, error: null };
    }

    return {
      data: Array.isArray(this._insertData) ? allResults : allResults[0] || null,
      error: null,
    };
  }

  private async _execUpdate(): Promise<SupabaseResult> {
    const keys = Object.keys(this._updateData).filter(
      (k) => this._updateData[k] !== undefined
    );
    const values = keys.map((k) => this._updateData[k]);
    const setClauses = keys.map((k, i) => `"${k}" = $${i + 1}`).join(", ");

    const where = this._buildWhere(values, keys.length + 1);
    const allParams = [...values, ...where.params];

    const sqlStr = `UPDATE "${this._table}" SET ${setClauses}${where.sql} RETURNING *`;
    const result = await pool.query(sqlStr, allParams);

    if (this._returnSingle || this._returnMaybeSingle || this._returnSelect) {
      if (this._returnSingle) {
        if (result.rows.length === 0)
          return { data: null, error: { message: "Row not found" } };
        return { data: result.rows[0], error: null };
      }
      if (this._returnMaybeSingle) {
        return {
          data: result.rows.length > 0 ? result.rows[0] : null,
          error: null,
        };
      }
      return { data: result.rows, error: null };
    }

    return { data: result.rows, error: null };
  }

  private async _execDelete(): Promise<SupabaseResult> {
    const where = this._buildWhere([], 1);
    const sqlStr = `DELETE FROM "${this._table}"${where.sql}`;
    await pool.query(sqlStr, where.params);
    return { data: null, error: null };
  }

  private async _execUpsert(): Promise<SupabaseResult> {
    const records = Array.isArray(this._insertData)
      ? this._insertData
      : [this._insertData];

    if (records.length === 0)
      return { data: [], error: null };

    const keys = Object.keys(records[0]).filter(
      (k) => records[0][k] !== undefined
    );
    const conflictCol = this._upsertOptions.onConflict || "id";

    const allResults: any[] = [];

    for (const record of records) {
      const values = keys.map((k) => record[k]);
      const cols = keys.map((k) => `"${k}"`).join(", ");
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
      const conflictCols = conflictCol.split(",").map((c) => `"${c.trim()}"`).join(", ");
      const updateClauses = keys
        .filter((k) => !conflictCol.split(",").map((c) => c.trim()).includes(k))
        .map((k) => `"${k}" = EXCLUDED."${k}"`)
        .join(", ");

      const sqlStr = updateClauses
        ? `INSERT INTO "${this._table}" (${cols}) VALUES (${placeholders}) ON CONFLICT (${conflictCols}) DO UPDATE SET ${updateClauses} RETURNING *`
        : `INSERT INTO "${this._table}" (${cols}) VALUES (${placeholders}) ON CONFLICT (${conflictCols}) DO NOTHING RETURNING *`;

      const result = await pool.query(sqlStr, values);
      allResults.push(...result.rows);
    }

    if (this._returnSingle || this._returnMaybeSingle) {
      return {
        data: allResults.length > 0 ? allResults[0] : null,
        error: null,
      };
    }

    return {
      data: Array.isArray(this._insertData) ? allResults : allResults[0] || null,
      error: null,
    };
  }
}

function singularize(t: string): string {
  if (t.endsWith("ies")) return t.slice(0, -3) + "y";
  if (t.endsWith("ses")) return t.slice(0, -2);
  if (t.endsWith("s")) return t.slice(0, -1);
  return t;
}

class StorageCompat {
  private _supabaseUrl: string;
  private _supabaseKey: string;

  constructor() {
    this._supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
    this._supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
  }

  from(bucket: string) {
    const supabaseUrl = this._supabaseUrl;
    const supabaseKey = this._supabaseKey;

    return {
      async upload(path: string, body: any, options?: any) {
        try {
          const res = await fetch(
            `${supabaseUrl}/storage/v1/object/${bucket}/${path}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": options?.contentType || "application/octet-stream",
                ...(options?.upsert ? { "x-upsert": "true" } : {}),
              },
              body,
            }
          );
          if (!res.ok) {
            const err = await res.text();
            return { data: null, error: { message: err } };
          }
          const data = await res.json();
          return { data, error: null };
        } catch (err: any) {
          return { data: null, error: { message: err.message } };
        }
      },

      getPublicUrl(path: string) {
        return {
          data: {
            publicUrl: `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`,
          },
        };
      },

      async createSignedUrl(path: string, expiresIn: number) {
        try {
          const res = await fetch(
            `${supabaseUrl}/storage/v1/object/sign/${bucket}/${path}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ expiresIn }),
            }
          );
          if (!res.ok) {
            const err = await res.text();
            return { data: null, error: { message: err } };
          }
          const data = await res.json();
          return {
            data: {
              signedUrl: `${supabaseUrl}/storage/v1${data.signedURL}`,
            },
            error: null,
          };
        } catch (err: any) {
          return { data: null, error: { message: err.message } };
        }
      },

      async download(path: string) {
        try {
          const res = await fetch(
            `${supabaseUrl}/storage/v1/object/${bucket}/${path}`,
            {
              headers: { Authorization: `Bearer ${supabaseKey}` },
            }
          );
          if (!res.ok) {
            const err = await res.text();
            return { data: null, error: { message: err } };
          }
          const blob = await res.blob();
          return { data: blob, error: null };
        } catch (err: any) {
          return { data: null, error: { message: err.message } };
        }
      },

      async list(path: string, options?: any) {
        try {
          const res = await fetch(
            `${supabaseUrl}/storage/v1/object/list/${bucket}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prefix: path,
                limit: options?.limit || 100,
                search: options?.search,
              }),
            }
          );
          if (!res.ok) {
            const err = await res.text();
            return { data: null, error: { message: err } };
          }
          const data = await res.json();
          return { data, error: null };
        } catch (err: any) {
          return { data: null, error: { message: err.message } };
        }
      },

      async remove(paths: string[]) {
        try {
          const res = await fetch(
            `${supabaseUrl}/storage/v1/object/${bucket}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ prefixes: paths }),
            }
          );
          if (!res.ok) {
            const err = await res.text();
            return { data: null, error: { message: err } };
          }
          const data = await res.json();
          return { data, error: null };
        } catch (err: any) {
          return { data: null, error: { message: err.message } };
        }
      },
    };
  }
}

class AuthAdminCompat {
  private _supabaseUrl: string;
  private _supabaseKey: string;

  constructor() {
    this._supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
    this._supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  }

  async createUser(params: { email: string; password: string; email_confirm?: boolean; user_metadata?: any }) {
    try {
      const res = await fetch(`${this._supabaseUrl}/auth/v1/admin/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this._supabaseKey}`,
          "Content-Type": "application/json",
          apikey: this._supabaseKey,
        },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Auth request failed" }));
        return { data: { user: null }, error: { message: err.message || err.msg || "Failed to create user" } };
      }
      const user = await res.json();
      return { data: { user }, error: null };
    } catch (err: any) {
      return { data: { user: null }, error: { message: err.message } };
    }
  }

  async updateUserById(id: string, params: any) {
    try {
      const res = await fetch(`${this._supabaseUrl}/auth/v1/admin/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this._supabaseKey}`,
          "Content-Type": "application/json",
          apikey: this._supabaseKey,
        },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Auth update failed" }));
        return { data: null, error: { message: err.message || err.msg || "Failed to update user" } };
      }
      const data = await res.json();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  }

  async deleteUser(id: string) {
    try {
      const res = await fetch(`${this._supabaseUrl}/auth/v1/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this._supabaseKey}`,
          "Content-Type": "application/json",
          apikey: this._supabaseKey,
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Auth delete failed" }));
        return { data: null, error: { message: err.message || err.msg || "Failed to delete user" } };
      }
      return { data: null, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  }
}

class AuthCompat {
  admin: AuthAdminCompat;

  constructor() {
    this.admin = new AuthAdminCompat();
  }
}

class LocalSupabaseClient {
  storage: StorageCompat;
  auth: AuthCompat;

  constructor() {
    this.storage = new StorageCompat();
    this.auth = new AuthCompat();
  }

  from(table: string): QueryBuilder {
    return new QueryBuilder(table);
  }

  async rpc(funcName: string, params?: any): Promise<SupabaseResult> {
    try {
      if (funcName === "exec_sql" && params?.sql) {
        await pool.query(params.sql);
        return { data: null, error: null };
      }
      return { data: null, error: { message: `Unknown RPC function: ${funcName}` } };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  }
}

export const localClient = new LocalSupabaseClient();
