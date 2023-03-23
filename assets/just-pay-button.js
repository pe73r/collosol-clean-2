var I;
(function(n) {
  n.assertEqual = (r) => r;
  function e(r) {
  }
  n.assertIs = e;
  function t(r) {
    throw new Error();
  }
  n.assertNever = t, n.arrayToEnum = (r) => {
    const i = {};
    for (const a of r)
      i[a] = a;
    return i;
  }, n.getValidEnumValues = (r) => {
    const i = n.objectKeys(r).filter((o) => typeof r[r[o]] != "number"), a = {};
    for (const o of i)
      a[o] = r[o];
    return n.objectValues(a);
  }, n.objectValues = (r) => n.objectKeys(r).map(function(i) {
    return r[i];
  }), n.objectKeys = typeof Object.keys == "function" ? (r) => Object.keys(r) : (r) => {
    const i = [];
    for (const a in r)
      Object.prototype.hasOwnProperty.call(r, a) && i.push(a);
    return i;
  }, n.find = (r, i) => {
    for (const a of r)
      if (i(a))
        return a;
  }, n.isInteger = typeof Number.isInteger == "function" ? (r) => Number.isInteger(r) : (r) => typeof r == "number" && isFinite(r) && Math.floor(r) === r;
  function s(r, i = " | ") {
    return r.map((a) => typeof a == "string" ? `'${a}'` : a).join(i);
  }
  n.joinValues = s, n.jsonStringifyReplacer = (r, i) => typeof i == "bigint" ? i.toString() : i;
})(I || (I = {}));
const p = I.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), B = (n) => {
  switch (typeof n) {
    case "undefined":
      return p.undefined;
    case "string":
      return p.string;
    case "number":
      return isNaN(n) ? p.nan : p.number;
    case "boolean":
      return p.boolean;
    case "function":
      return p.function;
    case "bigint":
      return p.bigint;
    case "object":
      return Array.isArray(n) ? p.array : n === null ? p.null : n.then && typeof n.then == "function" && n.catch && typeof n.catch == "function" ? p.promise : typeof Map < "u" && n instanceof Map ? p.map : typeof Set < "u" && n instanceof Set ? p.set : typeof Date < "u" && n instanceof Date ? p.date : p.object;
    default:
      return p.unknown;
  }
}, h = I.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of"
]), ss = (n) => JSON.stringify(n, null, 2).replace(/"([^"]+)":/g, "$1:");
class V extends Error {
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s) => {
      this.issues = [...this.issues, s];
    }, this.addIssues = (s = []) => {
      this.issues = [...this.issues, ...s];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  get errors() {
    return this.issues;
  }
  format(e) {
    const t = e || function(i) {
      return i.message;
    }, s = { _errors: [] }, r = (i) => {
      for (const a of i.issues)
        if (a.code === "invalid_union")
          a.unionErrors.map(r);
        else if (a.code === "invalid_return_type")
          r(a.returnTypeError);
        else if (a.code === "invalid_arguments")
          r(a.argumentsError);
        else if (a.path.length === 0)
          s._errors.push(t(a));
        else {
          let o = s, c = 0;
          for (; c < a.path.length; ) {
            const u = a.path[c];
            c === a.path.length - 1 ? (o[u] = o[u] || { _errors: [] }, o[u]._errors.push(t(a))) : o[u] = o[u] || { _errors: [] }, o = o[u], c++;
          }
        }
    };
    return r(this), s;
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, I.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, s = [];
    for (const r of this.issues)
      r.path.length > 0 ? (t[r.path[0]] = t[r.path[0]] || [], t[r.path[0]].push(e(r))) : s.push(e(r));
    return { formErrors: s, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
V.create = (n) => new V(n);
const me = (n, e) => {
  let t;
  switch (n.code) {
    case h.invalid_type:
      n.received === p.undefined ? t = "Required" : t = `Expected ${n.expected}, received ${n.received}`;
      break;
    case h.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(n.expected, I.jsonStringifyReplacer)}`;
      break;
    case h.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${I.joinValues(n.keys, ", ")}`;
      break;
    case h.invalid_union:
      t = "Invalid input";
      break;
    case h.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${I.joinValues(n.options)}`;
      break;
    case h.invalid_enum_value:
      t = `Invalid enum value. Expected ${I.joinValues(n.options)}, received '${n.received}'`;
      break;
    case h.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case h.invalid_return_type:
      t = "Invalid function return type";
      break;
    case h.invalid_date:
      t = "Invalid date";
      break;
    case h.invalid_string:
      typeof n.validation == "object" ? "startsWith" in n.validation ? t = `Invalid input: must start with "${n.validation.startsWith}"` : "endsWith" in n.validation ? t = `Invalid input: must end with "${n.validation.endsWith}"` : I.assertNever(n.validation) : n.validation !== "regex" ? t = `Invalid ${n.validation}` : t = "Invalid";
      break;
    case h.too_small:
      n.type === "array" ? t = `Array must contain ${n.inclusive ? "at least" : "more than"} ${n.minimum} element(s)` : n.type === "string" ? t = `String must contain ${n.inclusive ? "at least" : "over"} ${n.minimum} character(s)` : n.type === "number" ? t = `Number must be greater than ${n.inclusive ? "or equal to " : ""}${n.minimum}` : n.type === "date" ? t = `Date must be greater than ${n.inclusive ? "or equal to " : ""}${new Date(n.minimum)}` : t = "Invalid input";
      break;
    case h.too_big:
      n.type === "array" ? t = `Array must contain ${n.inclusive ? "at most" : "less than"} ${n.maximum} element(s)` : n.type === "string" ? t = `String must contain ${n.inclusive ? "at most" : "under"} ${n.maximum} character(s)` : n.type === "number" ? t = `Number must be less than ${n.inclusive ? "or equal to " : ""}${n.maximum}` : n.type === "date" ? t = `Date must be smaller than ${n.inclusive ? "or equal to " : ""}${new Date(n.maximum)}` : t = "Invalid input";
      break;
    case h.custom:
      t = "Invalid input";
      break;
    case h.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case h.not_multiple_of:
      t = `Number must be a multiple of ${n.multipleOf}`;
      break;
    default:
      t = e.defaultError, I.assertNever(n);
  }
  return { message: t };
};
let Vt = me;
function ns(n) {
  Vt = n;
}
function je() {
  return Vt;
}
const De = (n) => {
  const { data: e, path: t, errorMaps: s, issueData: r } = n, i = [...t, ...r.path || []], a = {
    ...r,
    path: i
  };
  let o = "";
  const c = s.filter((u) => !!u).slice().reverse();
  for (const u of c)
    o = u(a, { data: e, defaultError: o }).message;
  return {
    ...r,
    path: i,
    message: r.message || o
  };
}, rs = [];
function m(n, e) {
  const t = De({
    issueData: e,
    data: n.data,
    path: n.path,
    errorMaps: [
      n.common.contextualErrorMap,
      n.schemaErrorMap,
      je(),
      me
    ].filter((s) => !!s)
  });
  n.common.issues.push(t);
}
class E {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const s = [];
    for (const r of t) {
      if (r.status === "aborted")
        return g;
      r.status === "dirty" && e.dirty(), s.push(r.value);
    }
    return { status: e.value, value: s };
  }
  static async mergeObjectAsync(e, t) {
    const s = [];
    for (const r of t)
      s.push({
        key: await r.key,
        value: await r.value
      });
    return E.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const r of t) {
      const { key: i, value: a } = r;
      if (i.status === "aborted" || a.status === "aborted")
        return g;
      i.status === "dirty" && e.dirty(), a.status === "dirty" && e.dirty(), (typeof a.value < "u" || r.alwaysSet) && (s[i.value] = a.value);
    }
    return { status: e.value, value: s };
  }
}
const g = Object.freeze({
  status: "aborted"
}), is = (n) => ({ status: "dirty", value: n }), Z = (n) => ({ status: "valid", value: n }), tt = (n) => n.status === "aborted", st = (n) => n.status === "dirty", xe = (n) => n.status === "valid", nt = (n) => typeof Promise !== void 0 && n instanceof Promise;
var M;
(function(n) {
  n.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, n.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(M || (M = {}));
class z {
  constructor(e, t, s, r) {
    this.parent = e, this.data = t, this._path = s, this._key = r;
  }
  get path() {
    return this._path.concat(this._key);
  }
}
const mt = (n, e) => {
  if (xe(e))
    return { success: !0, data: e.value };
  if (!n.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return { success: !1, error: new V(n.common.issues) };
};
function _(n) {
  if (!n)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: r } = n;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: r } : { errorMap: (a, o) => a.code !== "invalid_type" ? { message: o.defaultError } : typeof o.data > "u" ? { message: s != null ? s : o.defaultError } : { message: t != null ? t : o.defaultError }, description: r };
}
class v {
  constructor(e) {
    this.spa = this.safeParseAsync, this.superRefine = this._refinement, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.default = this.default.bind(this), this.describe = this.describe.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return B(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: B(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new E(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: B(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (nt(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const s = this.safeParse(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  safeParse(e, t) {
    var s;
    const r = {
      common: {
        issues: [],
        async: (s = t == null ? void 0 : t.async) !== null && s !== void 0 ? s : !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: B(e)
    }, i = this._parseSync({ data: e, path: r.path, parent: r });
    return mt(r, i);
  }
  async parseAsync(e, t) {
    const s = await this.safeParseAsync(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  async safeParseAsync(e, t) {
    const s = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: B(e)
    }, r = this._parse({ data: e, path: [], parent: s }), i = await (nt(r) ? r : Promise.resolve(r));
    return mt(s, i);
  }
  refine(e, t) {
    const s = (r) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(r) : t;
    return this._refinement((r, i) => {
      const a = e(r), o = () => i.addIssue({
        code: h.custom,
        ...s(r)
      });
      return typeof Promise < "u" && a instanceof Promise ? a.then((c) => c ? !0 : (o(), !1)) : a ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((s, r) => e(s) ? !0 : (r.addIssue(typeof t == "function" ? t(s, r) : t), !1));
  }
  _refinement(e) {
    return new $({
      schema: this,
      typeName: y.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  optional() {
    return O.create(this);
  }
  nullable() {
    return F.create(this);
  }
  nullish() {
    return this.optional().nullable();
  }
  array() {
    return U.create(this);
  }
  promise() {
    return ie.create(this);
  }
  or(e) {
    return fe.create([this, e]);
  }
  and(e) {
    return ye.create(this, e);
  }
  transform(e) {
    return new $({
      schema: this,
      typeName: y.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ot({
      innerType: this,
      defaultValue: t,
      typeName: y.ZodDefault
    });
  }
  brand() {
    return new Yt({
      typeName: y.ZodBranded,
      type: this,
      ..._(void 0)
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const as = /^c[^\s-]{8,}$/i, os = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i, cs = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
class W extends v {
  constructor() {
    super(...arguments), this._regex = (e, t, s) => this.refinement((r) => e.test(r), {
      validation: t,
      code: h.invalid_string,
      ...M.errToObj(s)
    }), this.nonempty = (e) => this.min(1, M.errToObj(e)), this.trim = () => new W({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  _parse(e) {
    if (this._getType(e) !== p.string) {
      const i = this._getOrReturnCtx(e);
      return m(
        i,
        {
          code: h.invalid_type,
          expected: p.string,
          received: i.parsedType
        }
      ), g;
    }
    const s = new E();
    let r;
    for (const i of this._def.checks)
      if (i.kind === "min")
        e.data.length < i.value && (r = this._getOrReturnCtx(e, r), m(r, {
          code: h.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          message: i.message
        }), s.dirty());
      else if (i.kind === "max")
        e.data.length > i.value && (r = this._getOrReturnCtx(e, r), m(r, {
          code: h.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          message: i.message
        }), s.dirty());
      else if (i.kind === "email")
        cs.test(e.data) || (r = this._getOrReturnCtx(e, r), m(r, {
          validation: "email",
          code: h.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "uuid")
        os.test(e.data) || (r = this._getOrReturnCtx(e, r), m(r, {
          validation: "uuid",
          code: h.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "cuid")
        as.test(e.data) || (r = this._getOrReturnCtx(e, r), m(r, {
          validation: "cuid",
          code: h.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "url")
        try {
          new URL(e.data);
        } catch {
          r = this._getOrReturnCtx(e, r), m(r, {
            validation: "url",
            code: h.invalid_string,
            message: i.message
          }), s.dirty();
        }
      else
        i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (r = this._getOrReturnCtx(e, r), m(r, {
          validation: "regex",
          code: h.invalid_string,
          message: i.message
        }), s.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (r = this._getOrReturnCtx(e, r), m(r, {
          code: h.invalid_string,
          validation: { startsWith: i.value },
          message: i.message
        }), s.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (r = this._getOrReturnCtx(e, r), m(r, {
          code: h.invalid_string,
          validation: { endsWith: i.value },
          message: i.message
        }), s.dirty()) : I.assertNever(i);
    return { status: s.value, value: e.data };
  }
  _addCheck(e) {
    return new W({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...M.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...M.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...M.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...M.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...M.errToObj(t)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...M.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...M.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...M.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...M.errToObj(t)
    });
  }
  length(e, t) {
    return this.min(e, t).max(e, t);
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
W.create = (n) => new W({
  checks: [],
  typeName: y.ZodString,
  ..._(n)
});
function us(n, e) {
  const t = (n.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, r = t > s ? t : s, i = parseInt(n.toFixed(r).replace(".", "")), a = parseInt(e.toFixed(r).replace(".", ""));
  return i % a / Math.pow(10, r);
}
class H extends v {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._getType(e) !== p.number) {
      const i = this._getOrReturnCtx(e);
      return m(i, {
        code: h.invalid_type,
        expected: p.number,
        received: i.parsedType
      }), g;
    }
    let s;
    const r = new E();
    for (const i of this._def.checks)
      i.kind === "int" ? I.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
        code: h.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), r.dirty()) : i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (s = this._getOrReturnCtx(e, s), m(s, {
        code: h.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        message: i.message
      }), r.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (s = this._getOrReturnCtx(e, s), m(s, {
        code: h.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        message: i.message
      }), r.dirty()) : i.kind === "multipleOf" ? us(e.data, i.value) !== 0 && (s = this._getOrReturnCtx(e, s), m(s, {
        code: h.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), r.dirty()) : I.assertNever(i);
    return { status: r.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, M.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, M.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, M.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, M.toString(t));
  }
  setLimit(e, t, s, r) {
    return new H({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: M.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new H({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: M.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: M.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: M.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: M.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: M.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: M.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int");
  }
}
H.create = (n) => new H({
  checks: [],
  typeName: y.ZodNumber,
  ..._(n)
});
class Se extends v {
  _parse(e) {
    if (this._getType(e) !== p.bigint) {
      const s = this._getOrReturnCtx(e);
      return m(s, {
        code: h.invalid_type,
        expected: p.bigint,
        received: s.parsedType
      }), g;
    }
    return Z(e.data);
  }
}
Se.create = (n) => new Se({
  typeName: y.ZodBigInt,
  ..._(n)
});
class Te extends v {
  _parse(e) {
    if (this._getType(e) !== p.boolean) {
      const s = this._getOrReturnCtx(e);
      return m(s, {
        code: h.invalid_type,
        expected: p.boolean,
        received: s.parsedType
      }), g;
    }
    return Z(e.data);
  }
}
Te.create = (n) => new Te({
  typeName: y.ZodBoolean,
  ..._(n)
});
class ne extends v {
  _parse(e) {
    if (this._getType(e) !== p.date) {
      const i = this._getOrReturnCtx(e);
      return m(i, {
        code: h.invalid_type,
        expected: p.date,
        received: i.parsedType
      }), g;
    }
    if (isNaN(e.data.getTime())) {
      const i = this._getOrReturnCtx(e);
      return m(i, {
        code: h.invalid_date
      }), g;
    }
    const s = new E();
    let r;
    for (const i of this._def.checks)
      i.kind === "min" ? e.data.getTime() < i.value && (r = this._getOrReturnCtx(e, r), m(r, {
        code: h.too_small,
        message: i.message,
        inclusive: !0,
        minimum: i.value,
        type: "date"
      }), s.dirty()) : i.kind === "max" ? e.data.getTime() > i.value && (r = this._getOrReturnCtx(e, r), m(r, {
        code: h.too_big,
        message: i.message,
        inclusive: !0,
        maximum: i.value,
        type: "date"
      }), s.dirty()) : I.assertNever(i);
    return {
      status: s.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new ne({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: M.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: M.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
ne.create = (n) => new ne({
  checks: [],
  typeName: y.ZodDate,
  ..._(n)
});
class Ce extends v {
  _parse(e) {
    if (this._getType(e) !== p.undefined) {
      const s = this._getOrReturnCtx(e);
      return m(s, {
        code: h.invalid_type,
        expected: p.undefined,
        received: s.parsedType
      }), g;
    }
    return Z(e.data);
  }
}
Ce.create = (n) => new Ce({
  typeName: y.ZodUndefined,
  ..._(n)
});
class Ee extends v {
  _parse(e) {
    if (this._getType(e) !== p.null) {
      const s = this._getOrReturnCtx(e);
      return m(s, {
        code: h.invalid_type,
        expected: p.null,
        received: s.parsedType
      }), g;
    }
    return Z(e.data);
  }
}
Ee.create = (n) => new Ee({
  typeName: y.ZodNull,
  ..._(n)
});
class re extends v {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return Z(e.data);
  }
}
re.create = (n) => new re({
  typeName: y.ZodAny,
  ..._(n)
});
class X extends v {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return Z(e.data);
  }
}
X.create = (n) => new X({
  typeName: y.ZodUnknown,
  ..._(n)
});
class Q extends v {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return m(t, {
      code: h.invalid_type,
      expected: p.never,
      received: t.parsedType
    }), g;
  }
}
Q.create = (n) => new Q({
  typeName: y.ZodNever,
  ..._(n)
});
class Ze extends v {
  _parse(e) {
    if (this._getType(e) !== p.undefined) {
      const s = this._getOrReturnCtx(e);
      return m(s, {
        code: h.invalid_type,
        expected: p.void,
        received: s.parsedType
      }), g;
    }
    return Z(e.data);
  }
}
Ze.create = (n) => new Ze({
  typeName: y.ZodVoid,
  ..._(n)
});
class U extends v {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), r = this._def;
    if (t.parsedType !== p.array)
      return m(t, {
        code: h.invalid_type,
        expected: p.array,
        received: t.parsedType
      }), g;
    if (r.minLength !== null && t.data.length < r.minLength.value && (m(t, {
      code: h.too_small,
      minimum: r.minLength.value,
      type: "array",
      inclusive: !0,
      message: r.minLength.message
    }), s.dirty()), r.maxLength !== null && t.data.length > r.maxLength.value && (m(t, {
      code: h.too_big,
      maximum: r.maxLength.value,
      type: "array",
      inclusive: !0,
      message: r.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all(t.data.map((a, o) => r.type._parseAsync(new z(t, a, t.path, o)))).then((a) => E.mergeArray(s, a));
    const i = t.data.map((a, o) => r.type._parseSync(new z(t, a, t.path, o)));
    return E.mergeArray(s, i);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new U({
      ...this._def,
      minLength: { value: e, message: M.toString(t) }
    });
  }
  max(e, t) {
    return new U({
      ...this._def,
      maxLength: { value: e, message: M.toString(t) }
    });
  }
  length(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
U.create = (n, e) => new U({
  type: n,
  minLength: null,
  maxLength: null,
  typeName: y.ZodArray,
  ..._(e)
});
var ke;
(function(n) {
  n.mergeShapes = (e, t) => ({
    ...e,
    ...t
  });
})(ke || (ke = {}));
const ft = (n) => (e) => new j({
  ...n,
  shape: () => ({
    ...n.shape(),
    ...e
  })
});
function K(n) {
  if (n instanceof j) {
    const e = {};
    for (const t in n.shape) {
      const s = n.shape[t];
      e[t] = O.create(K(s));
    }
    return new j({
      ...n._def,
      shape: () => e
    });
  } else
    return n instanceof U ? U.create(K(n.element)) : n instanceof O ? O.create(K(n.unwrap())) : n instanceof F ? F.create(K(n.unwrap())) : n instanceof L ? L.create(n.items.map((e) => K(e))) : n;
}
class j extends v {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = ft(this._def), this.extend = ft(this._def);
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = I.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== p.object) {
      const u = this._getOrReturnCtx(e);
      return m(u, {
        code: h.invalid_type,
        expected: p.object,
        received: u.parsedType
      }), g;
    }
    const { status: s, ctx: r } = this._processInputParams(e), { shape: i, keys: a } = this._getCached(), o = [];
    for (const u in r.data)
      a.includes(u) || o.push(u);
    const c = [];
    for (const u of a) {
      const l = i[u], d = r.data[u];
      c.push({
        key: { status: "valid", value: u },
        value: l._parse(new z(r, d, r.path, u)),
        alwaysSet: u in r.data
      });
    }
    if (this._def.catchall instanceof Q) {
      const u = this._def.unknownKeys;
      if (u === "passthrough")
        for (const l of o)
          c.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: r.data[l] }
          });
      else if (u === "strict")
        o.length > 0 && (m(r, {
          code: h.unrecognized_keys,
          keys: o
        }), s.dirty());
      else if (u !== "strip")
        throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const u = this._def.catchall;
      for (const l of o) {
        const d = r.data[l];
        c.push({
          key: { status: "valid", value: l },
          value: u._parse(
            new z(r, d, r.path, l)
          ),
          alwaysSet: l in r.data
        });
      }
    }
    return r.common.async ? Promise.resolve().then(async () => {
      const u = [];
      for (const l of c) {
        const d = await l.key;
        u.push({
          key: d,
          value: await l.value,
          alwaysSet: l.alwaysSet
        });
      }
      return u;
    }).then((u) => E.mergeObjectSync(s, u)) : E.mergeObjectSync(s, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return M.errToObj, new j({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, s) => {
          var r, i, a, o;
          const c = (a = (i = (r = this._def).errorMap) === null || i === void 0 ? void 0 : i.call(r, t, s).message) !== null && a !== void 0 ? a : s.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (o = M.errToObj(e).message) !== null && o !== void 0 ? o : c
          } : {
            message: c
          };
        }
      } : {}
    });
  }
  strip() {
    return new j({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new j({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  merge(e) {
    return new j({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ke.mergeShapes(this._def.shape(), e._def.shape()),
      typeName: y.ZodObject
    });
  }
  catchall(e) {
    return new j({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    return I.objectKeys(e).map((s) => {
      this.shape[s] && (t[s] = this.shape[s]);
    }), new j({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return I.objectKeys(this.shape).map((s) => {
      I.objectKeys(e).indexOf(s) === -1 && (t[s] = this.shape[s]);
    }), new j({
      ...this._def,
      shape: () => t
    });
  }
  deepPartial() {
    return K(this);
  }
  partial(e) {
    const t = {};
    if (e)
      return I.objectKeys(this.shape).map((s) => {
        I.objectKeys(e).indexOf(s) === -1 ? t[s] = this.shape[s] : t[s] = this.shape[s].optional();
      }), new j({
        ...this._def,
        shape: () => t
      });
    for (const s in this.shape) {
      const r = this.shape[s];
      t[s] = r.optional();
    }
    return new j({
      ...this._def,
      shape: () => t
    });
  }
  required() {
    const e = {};
    for (const t in this.shape) {
      let r = this.shape[t];
      for (; r instanceof O; )
        r = r._def.innerType;
      e[t] = r;
    }
    return new j({
      ...this._def,
      shape: () => e
    });
  }
  keyof() {
    return Bt(I.objectKeys(this.shape));
  }
}
j.create = (n, e) => new j({
  shape: () => n,
  unknownKeys: "strip",
  catchall: Q.create(),
  typeName: y.ZodObject,
  ..._(e)
});
j.strictCreate = (n, e) => new j({
  shape: () => n,
  unknownKeys: "strict",
  catchall: Q.create(),
  typeName: y.ZodObject,
  ..._(e)
});
j.lazycreate = (n, e) => new j({
  shape: n,
  unknownKeys: "strip",
  catchall: Q.create(),
  typeName: y.ZodObject,
  ..._(e)
});
class fe extends v {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function r(i) {
      for (const o of i)
        if (o.result.status === "valid")
          return o.result;
      for (const o of i)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const a = i.map((o) => new V(o.ctx.common.issues));
      return m(t, {
        code: h.invalid_union,
        unionErrors: a
      }), g;
    }
    if (t.common.async)
      return Promise.all(s.map(async (i) => {
        const a = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await i._parseAsync({
            data: t.data,
            path: t.path,
            parent: a
          }),
          ctx: a
        };
      })).then(r);
    {
      let i;
      const a = [];
      for (const c of s) {
        const u = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, l = c._parseSync({
          data: t.data,
          path: t.path,
          parent: u
        });
        if (l.status === "valid")
          return l;
        l.status === "dirty" && !i && (i = { result: l, ctx: u }), u.common.issues.length && a.push(u.common.issues);
      }
      if (i)
        return t.common.issues.push(...i.ctx.common.issues), i.result;
      const o = a.map((c) => new V(c));
      return m(t, {
        code: h.invalid_union,
        unionErrors: o
      }), g;
    }
  }
  get options() {
    return this._def.options;
  }
}
fe.create = (n, e) => new fe({
  options: n,
  typeName: y.ZodUnion,
  ..._(e)
});
class Ve extends v {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== p.object)
      return m(t, {
        code: h.invalid_type,
        expected: p.object,
        received: t.parsedType
      }), g;
    const s = this.discriminator, r = t.data[s], i = this.options.get(r);
    return i ? t.common.async ? i._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : i._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (m(t, {
      code: h.invalid_union_discriminator,
      options: this.validDiscriminatorValues,
      path: [s]
    }), g);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get validDiscriminatorValues() {
    return Array.from(this.options.keys());
  }
  get options() {
    return this._def.options;
  }
  static create(e, t, s) {
    const r = /* @__PURE__ */ new Map();
    try {
      t.forEach((i) => {
        const a = i.shape[e].value;
        r.set(a, i);
      });
    } catch {
      throw new Error("The discriminator value could not be extracted from all the provided schemas");
    }
    if (r.size !== t.length)
      throw new Error("Some of the discriminator values are not unique");
    return new Ve({
      typeName: y.ZodDiscriminatedUnion,
      discriminator: e,
      options: r,
      ..._(s)
    });
  }
}
function rt(n, e) {
  const t = B(n), s = B(e);
  if (n === e)
    return { valid: !0, data: n };
  if (t === p.object && s === p.object) {
    const r = I.objectKeys(e), i = I.objectKeys(n).filter((o) => r.indexOf(o) !== -1), a = { ...n, ...e };
    for (const o of i) {
      const c = rt(n[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      a[o] = c.data;
    }
    return { valid: !0, data: a };
  } else if (t === p.array && s === p.array) {
    if (n.length !== e.length)
      return { valid: !1 };
    const r = [];
    for (let i = 0; i < n.length; i++) {
      const a = n[i], o = e[i], c = rt(a, o);
      if (!c.valid)
        return { valid: !1 };
      r.push(c.data);
    }
    return { valid: !0, data: r };
  } else
    return t === p.date && s === p.date && +n == +e ? { valid: !0, data: n } : { valid: !1 };
}
class ye extends v {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), r = (i, a) => {
      if (tt(i) || tt(a))
        return g;
      const o = rt(i.value, a.value);
      return o.valid ? ((st(i) || st(a)) && t.dirty(), { status: t.value, value: o.data }) : (m(s, {
        code: h.invalid_intersection_types
      }), g);
    };
    return s.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      }),
      this._def.right._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      })
    ]).then(([i, a]) => r(i, a)) : r(this._def.left._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }), this._def.right._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }));
  }
}
ye.create = (n, e, t) => new ye({
  left: n,
  right: e,
  typeName: y.ZodIntersection,
  ..._(t)
});
class L extends v {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== p.array)
      return m(s, {
        code: h.invalid_type,
        expected: p.array,
        received: s.parsedType
      }), g;
    if (s.data.length < this._def.items.length)
      return m(s, {
        code: h.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        type: "array"
      }), g;
    !this._def.rest && s.data.length > this._def.items.length && (m(s, {
      code: h.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      type: "array"
    }), t.dirty());
    const i = s.data.map((a, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new z(s, a, s.path, o)) : null;
    }).filter((a) => !!a);
    return s.common.async ? Promise.all(i).then((a) => E.mergeArray(t, a)) : E.mergeArray(t, i);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new L({
      ...this._def,
      rest: e
    });
  }
}
L.create = (n, e) => {
  if (!Array.isArray(n))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new L({
    items: n,
    typeName: y.ZodTuple,
    rest: null,
    ..._(e)
  });
};
class ge extends v {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== p.object)
      return m(s, {
        code: h.invalid_type,
        expected: p.object,
        received: s.parsedType
      }), g;
    const r = [], i = this._def.keyType, a = this._def.valueType;
    for (const o in s.data)
      r.push({
        key: i._parse(new z(s, o, s.path, o)),
        value: a._parse(new z(s, s.data[o], s.path, o))
      });
    return s.common.async ? E.mergeObjectAsync(t, r) : E.mergeObjectSync(t, r);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof v ? new ge({
      keyType: e,
      valueType: t,
      typeName: y.ZodRecord,
      ..._(s)
    }) : new ge({
      keyType: W.create(),
      valueType: e,
      typeName: y.ZodRecord,
      ..._(t)
    });
  }
}
class Oe extends v {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== p.map)
      return m(s, {
        code: h.invalid_type,
        expected: p.map,
        received: s.parsedType
      }), g;
    const r = this._def.keyType, i = this._def.valueType, a = [...s.data.entries()].map(([o, c], u) => ({
      key: r._parse(new z(s, o, s.path, [u, "key"])),
      value: i._parse(new z(s, c, s.path, [u, "value"]))
    }));
    if (s.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of a) {
          const u = await c.key, l = await c.value;
          if (u.status === "aborted" || l.status === "aborted")
            return g;
          (u.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(u.value, l.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const c of a) {
        const u = c.key, l = c.value;
        if (u.status === "aborted" || l.status === "aborted")
          return g;
        (u.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(u.value, l.value);
      }
      return { status: t.value, value: o };
    }
  }
}
Oe.create = (n, e, t) => new Oe({
  valueType: e,
  keyType: n,
  typeName: y.ZodMap,
  ..._(t)
});
class J extends v {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== p.set)
      return m(s, {
        code: h.invalid_type,
        expected: p.set,
        received: s.parsedType
      }), g;
    const r = this._def;
    r.minSize !== null && s.data.size < r.minSize.value && (m(s, {
      code: h.too_small,
      minimum: r.minSize.value,
      type: "set",
      inclusive: !0,
      message: r.minSize.message
    }), t.dirty()), r.maxSize !== null && s.data.size > r.maxSize.value && (m(s, {
      code: h.too_big,
      maximum: r.maxSize.value,
      type: "set",
      inclusive: !0,
      message: r.maxSize.message
    }), t.dirty());
    const i = this._def.valueType;
    function a(c) {
      const u = /* @__PURE__ */ new Set();
      for (const l of c) {
        if (l.status === "aborted")
          return g;
        l.status === "dirty" && t.dirty(), u.add(l.value);
      }
      return { status: t.value, value: u };
    }
    const o = [...s.data.values()].map((c, u) => i._parse(new z(s, c, s.path, u)));
    return s.common.async ? Promise.all(o).then((c) => a(c)) : a(o);
  }
  min(e, t) {
    return new J({
      ...this._def,
      minSize: { value: e, message: M.toString(t) }
    });
  }
  max(e, t) {
    return new J({
      ...this._def,
      maxSize: { value: e, message: M.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
J.create = (n, e) => new J({
  valueType: n,
  minSize: null,
  maxSize: null,
  typeName: y.ZodSet,
  ..._(e)
});
class ee extends v {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== p.function)
      return m(t, {
        code: h.invalid_type,
        expected: p.function,
        received: t.parsedType
      }), g;
    function s(o, c) {
      return De({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          je(),
          me
        ].filter((u) => !!u),
        issueData: {
          code: h.invalid_arguments,
          argumentsError: c
        }
      });
    }
    function r(o, c) {
      return De({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          je(),
          me
        ].filter((u) => !!u),
        issueData: {
          code: h.invalid_return_type,
          returnTypeError: c
        }
      });
    }
    const i = { errorMap: t.common.contextualErrorMap }, a = t.data;
    return this._def.returns instanceof ie ? Z(async (...o) => {
      const c = new V([]), u = await this._def.args.parseAsync(o, i).catch((f) => {
        throw c.addIssue(s(o, f)), c;
      }), l = await a(...u);
      return await this._def.returns._def.type.parseAsync(l, i).catch((f) => {
        throw c.addIssue(r(l, f)), c;
      });
    }) : Z((...o) => {
      const c = this._def.args.safeParse(o, i);
      if (!c.success)
        throw new V([s(o, c.error)]);
      const u = a(...c.data), l = this._def.returns.safeParse(u, i);
      if (!l.success)
        throw new V([r(u, l.error)]);
      return l.data;
    });
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new ee({
      ...this._def,
      args: L.create(e).rest(X.create())
    });
  }
  returns(e) {
    return new ee({
      ...this._def,
      returns: e
    });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, t, s) {
    return new ee({
      args: e || L.create([]).rest(X.create()),
      returns: t || X.create(),
      typeName: y.ZodFunction,
      ..._(s)
    });
  }
}
class ze extends v {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
ze.create = (n, e) => new ze({
  getter: n,
  typeName: y.ZodLazy,
  ..._(e)
});
class Ue extends v {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return m(t, {
        code: h.invalid_literal,
        expected: this._def.value
      }), g;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Ue.create = (n, e) => new Ue({
  value: n,
  typeName: y.ZodLiteral,
  ..._(e)
});
function Bt(n, e) {
  return new Be({
    values: n,
    typeName: y.ZodEnum,
    ..._(e)
  });
}
class Be extends v {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return m(t, {
        expected: I.joinValues(s),
        received: t.parsedType,
        code: h.invalid_type
      }), g;
    }
    if (this._def.values.indexOf(e.data) === -1) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return m(t, {
        received: t.data,
        code: h.invalid_enum_value,
        options: s
      }), g;
    }
    return Z(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
}
Be.create = Bt;
class Le extends v {
  _parse(e) {
    const t = I.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== p.string && s.parsedType !== p.number) {
      const r = I.objectValues(t);
      return m(s, {
        expected: I.joinValues(r),
        received: s.parsedType,
        code: h.invalid_type
      }), g;
    }
    if (t.indexOf(e.data) === -1) {
      const r = I.objectValues(t);
      return m(s, {
        received: s.data,
        code: h.invalid_enum_value,
        options: r
      }), g;
    }
    return Z(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Le.create = (n, e) => new Le({
  values: n,
  typeName: y.ZodNativeEnum,
  ..._(e)
});
class ie extends v {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== p.promise && t.common.async === !1)
      return m(t, {
        code: h.invalid_type,
        expected: p.promise,
        received: t.parsedType
      }), g;
    const s = t.parsedType === p.promise ? t.data : Promise.resolve(t.data);
    return Z(s.then((r) => this._def.type.parseAsync(r, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
ie.create = (n, e) => new ie({
  type: n,
  typeName: y.ZodPromise,
  ..._(e)
});
class $ extends v {
  innerType() {
    return this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), r = this._def.effect || null;
    if (r.type === "preprocess") {
      const a = r.transform(s.data);
      return s.common.async ? Promise.resolve(a).then((o) => this._def.schema._parseAsync({
        data: o,
        path: s.path,
        parent: s
      })) : this._def.schema._parseSync({
        data: a,
        path: s.path,
        parent: s
      });
    }
    const i = {
      addIssue: (a) => {
        m(s, a), a.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return s.path;
      }
    };
    if (i.addIssue = i.addIssue.bind(i), r.type === "refinement") {
      const a = (o) => {
        const c = r.refinement(o, i);
        if (s.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (s.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? g : (o.status === "dirty" && t.dirty(), a(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => o.status === "aborted" ? g : (o.status === "dirty" && t.dirty(), a(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (r.type === "transform")
      if (s.common.async === !1) {
        const a = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!xe(a))
          return a;
        const o = r.transform(a.value, i);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((a) => xe(a) ? Promise.resolve(r.transform(a.value, i)).then((o) => ({ status: t.value, value: o })) : a);
    I.assertNever(r);
  }
}
$.create = (n, e, t) => new $({
  schema: n,
  typeName: y.ZodEffects,
  effect: e,
  ..._(t)
});
$.createWithPreprocess = (n, e, t) => new $({
  schema: e,
  effect: { type: "preprocess", transform: n },
  typeName: y.ZodEffects,
  ..._(t)
});
class O extends v {
  _parse(e) {
    return this._getType(e) === p.undefined ? Z(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
O.create = (n, e) => new O({
  innerType: n,
  typeName: y.ZodOptional,
  ..._(e)
});
class F extends v {
  _parse(e) {
    return this._getType(e) === p.null ? Z(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
F.create = (n, e) => new F({
  innerType: n,
  typeName: y.ZodNullable,
  ..._(e)
});
class ot extends v {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let s = t.data;
    return t.parsedType === p.undefined && (s = this._def.defaultValue()), this._def.innerType._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ot.create = (n, e) => new O({
  innerType: n,
  typeName: y.ZodOptional,
  ..._(e)
});
class $e extends v {
  _parse(e) {
    if (this._getType(e) !== p.nan) {
      const s = this._getOrReturnCtx(e);
      return m(s, {
        code: h.invalid_type,
        expected: p.nan,
        received: s.parsedType
      }), g;
    }
    return { status: "valid", value: e.data };
  }
}
$e.create = (n) => new $e({
  typeName: y.ZodNaN,
  ..._(n)
});
const ls = Symbol("zod_brand");
class Yt extends v {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = t.data;
    return this._def.type._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
const Wt = (n, e = {}, t) => n ? re.create().superRefine((s, r) => {
  if (!n(s)) {
    const i = typeof e == "function" ? e(s) : e, a = typeof i == "string" ? { message: i } : i;
    r.addIssue({ code: "custom", ...a, fatal: t });
  }
}) : re.create(), ds = {
  object: j.lazycreate
};
var y;
(function(n) {
  n.ZodString = "ZodString", n.ZodNumber = "ZodNumber", n.ZodNaN = "ZodNaN", n.ZodBigInt = "ZodBigInt", n.ZodBoolean = "ZodBoolean", n.ZodDate = "ZodDate", n.ZodUndefined = "ZodUndefined", n.ZodNull = "ZodNull", n.ZodAny = "ZodAny", n.ZodUnknown = "ZodUnknown", n.ZodNever = "ZodNever", n.ZodVoid = "ZodVoid", n.ZodArray = "ZodArray", n.ZodObject = "ZodObject", n.ZodUnion = "ZodUnion", n.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", n.ZodIntersection = "ZodIntersection", n.ZodTuple = "ZodTuple", n.ZodRecord = "ZodRecord", n.ZodMap = "ZodMap", n.ZodSet = "ZodSet", n.ZodFunction = "ZodFunction", n.ZodLazy = "ZodLazy", n.ZodLiteral = "ZodLiteral", n.ZodEnum = "ZodEnum", n.ZodEffects = "ZodEffects", n.ZodNativeEnum = "ZodNativeEnum", n.ZodOptional = "ZodOptional", n.ZodNullable = "ZodNullable", n.ZodDefault = "ZodDefault", n.ZodPromise = "ZodPromise", n.ZodBranded = "ZodBranded";
})(y || (y = {}));
const hs = (n, e = {
  message: `Input not instance of ${n.name}`
}) => Wt((t) => t instanceof n, e, !0), Qt = W.create, Gt = H.create, ps = $e.create, ms = Se.create, Xt = Te.create, fs = ne.create, ys = Ce.create, gs = Ee.create, vs = re.create, _s = X.create, Ms = Q.create, Is = Ze.create, Ns = U.create, bs = j.create, ws = j.strictCreate, As = fe.create, js = Ve.create, Ds = ye.create, xs = L.create, Ss = ge.create, Ts = Oe.create, Cs = J.create, Es = ee.create, Zs = ze.create, ks = Ue.create, Os = Be.create, zs = Le.create, Us = ie.create, yt = $.create, Ls = O.create, $s = F.create, Ps = $.createWithPreprocess, Rs = () => Qt().optional(), Vs = () => Gt().optional(), Bs = () => Xt().optional(), Ys = g;
var x = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  getParsedType: B,
  ZodParsedType: p,
  defaultErrorMap: me,
  setErrorMap: ns,
  getErrorMap: je,
  makeIssue: De,
  EMPTY_PATH: rs,
  addIssueToContext: m,
  ParseStatus: E,
  INVALID: g,
  DIRTY: is,
  OK: Z,
  isAborted: tt,
  isDirty: st,
  isValid: xe,
  isAsync: nt,
  ZodType: v,
  ZodString: W,
  ZodNumber: H,
  ZodBigInt: Se,
  ZodBoolean: Te,
  ZodDate: ne,
  ZodUndefined: Ce,
  ZodNull: Ee,
  ZodAny: re,
  ZodUnknown: X,
  ZodNever: Q,
  ZodVoid: Ze,
  ZodArray: U,
  get objectUtil() {
    return ke;
  },
  ZodObject: j,
  ZodUnion: fe,
  ZodDiscriminatedUnion: Ve,
  ZodIntersection: ye,
  ZodTuple: L,
  ZodRecord: ge,
  ZodMap: Oe,
  ZodSet: J,
  ZodFunction: ee,
  ZodLazy: ze,
  ZodLiteral: Ue,
  ZodEnum: Be,
  ZodNativeEnum: Le,
  ZodPromise: ie,
  ZodEffects: $,
  ZodTransformer: $,
  ZodOptional: O,
  ZodNullable: F,
  ZodDefault: ot,
  ZodNaN: $e,
  BRAND: ls,
  ZodBranded: Yt,
  custom: Wt,
  Schema: v,
  ZodSchema: v,
  late: ds,
  get ZodFirstPartyTypeKind() {
    return y;
  },
  any: vs,
  array: Ns,
  bigint: ms,
  boolean: Xt,
  date: fs,
  discriminatedUnion: js,
  effect: yt,
  enum: Os,
  function: Es,
  instanceof: hs,
  intersection: Ds,
  lazy: Zs,
  literal: ks,
  map: Ts,
  nan: ps,
  nativeEnum: zs,
  never: Ms,
  null: gs,
  nullable: $s,
  number: Gt,
  object: bs,
  oboolean: Bs,
  onumber: Vs,
  optional: Ls,
  ostring: Rs,
  preprocess: Ps,
  promise: Us,
  record: Ss,
  set: Cs,
  strictObject: ws,
  string: Qt,
  transformer: yt,
  tuple: xs,
  undefined: ys,
  union: As,
  unknown: _s,
  void: Is,
  NEVER: Ys,
  ZodIssueCode: h,
  quotelessJson: ss,
  ZodError: V
});
const Ws = x.object({
  id: x.number(),
  key: x.string(),
  attachment: x.record(x.string())
});
x.object({
  dataRecordsEnabled: x.boolean(),
  description: x.string(),
  enabled: x.boolean(),
  id: x.number(),
  key: x.string(),
  updatedAt: x.string(),
  variants: Ws.array().optional()
});
const Qs = x.object({
  flagID: x.number(),
  flagKey: x.string(),
  flagSnapshotID: x.number(),
  segmentID: x.number().optional(),
  timestamp: x.string(),
  variantAttachment: x.record(x.string()).optional(),
  variantID: x.number().optional(),
  variantKey: x.string().optional()
}), Gs = "https://flagr.tools.getjust.eu/api/v1";
async function Xs(n, e) {
  const t = await fetch(`${Gs}/evaluation`, {
    method: "POST",
    body: JSON.stringify({
      flagKey: n,
      enableDebug: !1,
      entityContext: e != null ? e : {}
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }), s = Qs.parse(await t.json());
  return (s == null ? void 0 : s.variantKey) === "on";
}
const Hs = "en", Js = ["en", "fr"];
function Fs() {
  return /^en\b/.test(navigator.language) ? navigator.language.split("-")[0] : "fr";
}
const Ye = async (n, e) => {
  const t = await (await fetch(n)).json();
  return e ? t.variants.find(
    (s) => s.id == e
  ) : t.variants[0];
}, Ks = async () => await (await fetch("/cart.json")).json();
async function qs(n, e) {
  var t, s;
  const { searchParams: r, pathname: i } = new URL(window.location.href), a = `/products/${i.toLowerCase().split("/products/")[1]}.js`, o = e != null ? e : r.get("variant"), c = await Ye(a, o ? parseInt(o, 10) : null), u = parseInt((s = (t = window.document.getElementById(n)) == null ? void 0 : t.value) != null ? s : "1", 10);
  return {
    ...c,
    quantity: u
  };
}
async function gt() {
  return await Ks();
}
async function en(n) {
  var e, t, s;
  const r = `[product_id="${n}"]`, i = window.document.querySelector(r);
  if (!i)
    throw "btn not found";
  const a = i.closest("form");
  if (!i)
    throw "form not found";
  a.getAttribute("id");
  const o = parseInt(a.id.value), c = parseInt((s = (t = (e = a == null ? void 0 : a.querySelector) == null ? void 0 : e.call(a, '[name="quantity"]')) == null ? void 0 : t.value) != null ? s : "1"), u = Array.from(a.querySelectorAll("input, textarea, select")).filter((l) => {
    var d;
    return ((d = l.name) == null ? void 0 : d.includes("properties")) && l.value;
  }).map((l) => {
    var d, f;
    const A = (d = l.name) == null ? void 0 : d.match(/\[(.*?)\]/);
    return {
      key: (f = A == null ? void 0 : A[1]) != null ? f : "",
      value: l.value
    };
  }).filter((l) => l.value).reduce((l, d) => (l[d.key] = d.value, l), {});
  return {
    items: [
      {
        variantId: o,
        quantity: c,
        properties: u
      }
    ]
  };
}
async function tn(n, e) {
  var t, s;
  const r = `/products/${n}.js`, i = await Ye(r, null), a = parseInt((s = (t = window.document.getElementById(e)) == null ? void 0 : t.value) != null ? s : "1", 10);
  return {
    ...i,
    quantity: a
  };
}
async function sn(n) {
  var e;
  const { searchParams: t, pathname: s } = new URL(window.location.href), r = `/products/${s.toLowerCase().split("/products/")[1]}.js`, i = (e = t.get("variant")) != null ? e : n;
  return (await Ye(r, i ? parseInt(i, 10) : null)).available;
}
async function nn(n, e) {
  const t = `/products/${n}.js`;
  return (await Ye(t, parseInt(e))).available;
}
function rn() {
  var n, e, t, s, r, i, a, o, c, u, l, d;
  const f = (A) => Js.indexOf(A) !== -1 ? A : Hs;
  return (n = window == null ? void 0 : window.Weglot) != null && n.getCurrentLang() ? (window.Weglot.on("languageChanged", (A) => {
    this.language = f(A);
  }), f((e = window.Weglot) == null ? void 0 : e.getCurrentLang())) : (s = (t = window == null ? void 0 : window._transcy) == null ? void 0 : t.variants) != null && s.localeCurrent ? f((i = (r = window._transcy) == null ? void 0 : r.variants) == null ? void 0 : i.localeCurrent) : (o = (a = window == null ? void 0 : window.langify) == null ? void 0 : a.locale) != null && o.iso_code ? f((u = (c = window.langify) == null ? void 0 : c.locale) == null ? void 0 : u.iso_code) : (l = window == null ? void 0 : window.Shopify) != null && l.locale ? f((d = window.Shopify) == null ? void 0 : d.locale) : f(Fs());
}
function R(n) {
  if (n === null || n === !0 || n === !1)
    return NaN;
  var e = Number(n);
  return isNaN(e) ? e : e < 0 ? Math.ceil(e) : Math.floor(e);
}
function T(n, e) {
  if (e.length < n)
    throw new TypeError(n + " argument" + (n > 1 ? "s" : "") + " required, but only " + e.length + " present");
}
function D(n) {
  T(1, arguments);
  var e = Object.prototype.toString.call(n);
  return n instanceof Date || typeof n == "object" && e === "[object Date]" ? new Date(n.getTime()) : typeof n == "number" || e === "[object Number]" ? new Date(n) : ((typeof n == "string" || e === "[object String]") && typeof console < "u" && (console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"), console.warn(new Error().stack)), new Date(NaN));
}
function an(n, e) {
  T(2, arguments);
  var t = D(n), s = R(e);
  return isNaN(s) ? new Date(NaN) : (s && t.setDate(t.getDate() + s), t);
}
function on(n, e) {
  T(2, arguments);
  var t = D(n), s = R(e);
  if (isNaN(s))
    return new Date(NaN);
  if (!s)
    return t;
  var r = t.getDate(), i = new Date(t.getTime());
  i.setMonth(t.getMonth() + s + 1, 0);
  var a = i.getDate();
  return r >= a ? i : (t.setFullYear(i.getFullYear(), i.getMonth(), r), t);
}
function le(n, e) {
  if (T(2, arguments), !e || typeof e != "object")
    return new Date(NaN);
  var t = e.years ? R(e.years) : 0, s = e.months ? R(e.months) : 0, r = e.weeks ? R(e.weeks) : 0, i = e.days ? R(e.days) : 0, a = e.hours ? R(e.hours) : 0, o = e.minutes ? R(e.minutes) : 0, c = e.seconds ? R(e.seconds) : 0, u = D(n), l = s || t ? on(u, s + t * 12) : u, d = i || r ? an(l, i + r * 7) : l, f = o + a * 60, A = c + f * 60, k = A * 1e3, P = new Date(d.getTime() + k);
  return P;
}
function vt(n) {
  var e = new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds(), n.getMilliseconds()));
  return e.setUTCFullYear(n.getFullYear()), n.getTime() - e.getTime();
}
function _t(n) {
  T(1, arguments);
  var e = D(n);
  return e.setHours(0, 0, 0, 0), e;
}
var cn = 864e5;
function un(n, e) {
  T(2, arguments);
  var t = _t(n), s = _t(e), r = t.getTime() - vt(t), i = s.getTime() - vt(s);
  return Math.round((r - i) / cn);
}
function te(n, e) {
  T(2, arguments);
  var t = D(n), s = D(e), r = t.getTime() - s.getTime();
  return r < 0 ? -1 : r > 0 ? 1 : r;
}
var ln = 6e4, dn = 36e5;
function hn(n, e) {
  T(2, arguments);
  var t = D(n), s = D(e), r = t.getFullYear() - s.getFullYear(), i = t.getMonth() - s.getMonth();
  return r * 12 + i;
}
function pn(n, e) {
  T(2, arguments);
  var t = D(n), s = D(e);
  return t.getFullYear() - s.getFullYear();
}
function Mt(n, e) {
  var t = n.getFullYear() - e.getFullYear() || n.getMonth() - e.getMonth() || n.getDate() - e.getDate() || n.getHours() - e.getHours() || n.getMinutes() - e.getMinutes() || n.getSeconds() - e.getSeconds() || n.getMilliseconds() - e.getMilliseconds();
  return t < 0 ? -1 : t > 0 ? 1 : t;
}
function mn(n, e) {
  T(2, arguments);
  var t = D(n), s = D(e), r = Mt(t, s), i = Math.abs(un(t, s));
  t.setDate(t.getDate() - r * i);
  var a = Number(Mt(t, s) === -r), o = r * (i - a);
  return o === 0 ? 0 : o;
}
function We(n, e) {
  return T(2, arguments), D(n).getTime() - D(e).getTime();
}
var It = {
  ceil: Math.ceil,
  round: Math.round,
  floor: Math.floor,
  trunc: function(n) {
    return n < 0 ? Math.ceil(n) : Math.floor(n);
  }
}, fn = "trunc";
function ct(n) {
  return n ? It[n] : It[fn];
}
function yn(n, e, t) {
  T(2, arguments);
  var s = We(n, e) / dn;
  return ct(t == null ? void 0 : t.roundingMethod)(s);
}
function gn(n, e, t) {
  T(2, arguments);
  var s = We(n, e) / ln;
  return ct(t == null ? void 0 : t.roundingMethod)(s);
}
function vn(n) {
  T(1, arguments);
  var e = D(n);
  return e.setHours(23, 59, 59, 999), e;
}
function _n(n) {
  T(1, arguments);
  var e = D(n), t = e.getMonth();
  return e.setFullYear(e.getFullYear(), t + 1, 0), e.setHours(23, 59, 59, 999), e;
}
function Mn(n) {
  T(1, arguments);
  var e = D(n);
  return vn(e).getTime() === _n(e).getTime();
}
function In(n, e) {
  T(2, arguments);
  var t = D(n), s = D(e), r = te(t, s), i = Math.abs(hn(t, s)), a;
  if (i < 1)
    a = 0;
  else {
    t.getMonth() === 1 && t.getDate() > 27 && t.setDate(30), t.setMonth(t.getMonth() - r * i);
    var o = te(t, s) === -r;
    Mn(D(n)) && i === 1 && te(n, s) === 1 && (o = !1), a = r * (i - Number(o));
  }
  return a === 0 ? 0 : a;
}
function Nn(n, e, t) {
  T(2, arguments);
  var s = We(n, e) / 1e3;
  return ct(t == null ? void 0 : t.roundingMethod)(s);
}
function bn(n, e) {
  T(2, arguments);
  var t = D(n), s = D(e), r = te(t, s), i = Math.abs(pn(t, s));
  t.setFullYear(1584), s.setFullYear(1584);
  var a = te(t, s) === -r, o = r * (i - Number(a));
  return o === 0 ? 0 : o;
}
function wn(n) {
  T(1, arguments);
  var e = D(n.start), t = D(n.end);
  if (isNaN(e.getTime()))
    throw new RangeError("Start Date is invalid");
  if (isNaN(t.getTime()))
    throw new RangeError("End Date is invalid");
  var s = {};
  s.years = Math.abs(bn(t, e));
  var r = te(t, e), i = le(e, {
    years: r * s.years
  });
  s.months = Math.abs(In(t, i));
  var a = le(i, {
    months: r * s.months
  });
  s.days = Math.abs(mn(t, a));
  var o = le(a, {
    days: r * s.days
  });
  s.hours = Math.abs(yn(t, o));
  var c = le(o, {
    hours: r * s.hours
  });
  s.minutes = Math.abs(gn(t, c));
  var u = le(c, {
    minutes: r * s.minutes
  });
  return s.seconds = Math.abs(Nn(t, u)), s;
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ae = window, ut = Ae.ShadowRoot && (Ae.ShadyCSS === void 0 || Ae.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ht = Symbol(), Nt = /* @__PURE__ */ new WeakMap();
class An {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== Ht)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (ut && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Nt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Nt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
}
const jn = (n) => new An(typeof n == "string" ? n : n + "", void 0, Ht), Dn = (n, e) => {
  ut ? n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet) : e.forEach((t) => {
    const s = document.createElement("style"), r = Ae.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = t.cssText, n.appendChild(s);
  });
}, bt = ut ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules)
    t += s.cssText;
  return jn(t);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Ge;
const Pe = window, wt = Pe.trustedTypes, xn = wt ? wt.emptyScript : "", At = Pe.reactiveElementPolyfillSupport, it = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? xn : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, e) {
  let t = n;
  switch (e) {
    case Boolean:
      t = n !== null;
      break;
    case Number:
      t = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(n);
      } catch {
        t = null;
      }
  }
  return t;
} }, Jt = (n, e) => e !== n && (e == e || n == n), Xe = { attribute: !0, type: String, converter: it, reflect: !1, hasChanged: Jt };
class de extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this.u();
  }
  static addInitializer(e) {
    var t;
    (t = this.h) !== null && t !== void 0 || (this.h = []), this.h.push(e);
  }
  static get observedAttributes() {
    this.finalize();
    const e = [];
    return this.elementProperties.forEach((t, s) => {
      const r = this._$Ep(s, t);
      r !== void 0 && (this._$Ev.set(r, s), e.push(r));
    }), e;
  }
  static createProperty(e, t = Xe) {
    if (t.state && (t.attribute = !1), this.finalize(), this.elementProperties.set(e, t), !t.noAccessor && !this.prototype.hasOwnProperty(e)) {
      const s = typeof e == "symbol" ? Symbol() : "__" + e, r = this.getPropertyDescriptor(e, s, t);
      r !== void 0 && Object.defineProperty(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    return { get() {
      return this[t];
    }, set(r) {
      const i = this[e];
      this[t] = r, this.requestUpdate(e, i, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) || Xe;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return !1;
    this.finalized = !0;
    const e = Object.getPrototypeOf(this);
    if (e.finalize(), this.elementProperties = new Map(e.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t = this.properties, s = [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)];
      for (const r of s)
        this.createProperty(r, t[r]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const r of s)
        t.unshift(bt(r));
    } else
      e !== void 0 && t.push(bt(e));
    return t;
  }
  static _$Ep(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  u() {
    var e;
    this._$E_ = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (e = this.constructor.h) === null || e === void 0 || e.forEach((t) => t(this));
  }
  addController(e) {
    var t, s;
    ((t = this._$ES) !== null && t !== void 0 ? t : this._$ES = []).push(e), this.renderRoot !== void 0 && this.isConnected && ((s = e.hostConnected) === null || s === void 0 || s.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$ES) === null || t === void 0 || t.splice(this._$ES.indexOf(e) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((e, t) => {
      this.hasOwnProperty(t) && (this._$Ei.set(t, this[t]), delete this[t]);
    });
  }
  createRenderRoot() {
    var e;
    const t = (e = this.shadowRoot) !== null && e !== void 0 ? e : this.attachShadow(this.constructor.shadowRootOptions);
    return Dn(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var e;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$ES) === null || e === void 0 || e.forEach((t) => {
      var s;
      return (s = t.hostConnected) === null || s === void 0 ? void 0 : s.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$ES) === null || e === void 0 || e.forEach((t) => {
      var s;
      return (s = t.hostDisconnected) === null || s === void 0 ? void 0 : s.call(t);
    });
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$EO(e, t, s = Xe) {
    var r;
    const i = this.constructor._$Ep(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const a = (((r = s.converter) === null || r === void 0 ? void 0 : r.toAttribute) !== void 0 ? s.converter : it).toAttribute(t, s.type);
      this._$El = e, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$El = null;
    }
  }
  _$AK(e, t) {
    var s;
    const r = this.constructor, i = r._$Ev.get(e);
    if (i !== void 0 && this._$El !== i) {
      const a = r.getPropertyOptions(i), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((s = a.converter) === null || s === void 0 ? void 0 : s.fromAttribute) !== void 0 ? a.converter : it;
      this._$El = i, this[i] = o.fromAttribute(t, a.type), this._$El = null;
    }
  }
  requestUpdate(e, t, s) {
    let r = !0;
    e !== void 0 && (((s = s || this.constructor.getPropertyOptions(e)).hasChanged || Jt)(this[e], t) ? (this._$AL.has(e) || this._$AL.set(e, t), s.reflect === !0 && this._$El !== e && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(e, s))) : r = !1), !this.isUpdatePending && r && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var e;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((r, i) => this[i] = r), this._$Ei = void 0);
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), (e = this._$ES) === null || e === void 0 || e.forEach((r) => {
        var i;
        return (i = r.hostUpdate) === null || i === void 0 ? void 0 : i.call(r);
      }), this.update(s)) : this._$Ek();
    } catch (r) {
      throw t = !1, this._$Ek(), r;
    }
    t && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach((s) => {
      var r;
      return (r = s.hostUpdated) === null || r === void 0 ? void 0 : r.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$EC !== void 0 && (this._$EC.forEach((t, s) => this._$EO(s, this[s], t)), this._$EC = void 0), this._$Ek();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
}
de.finalized = !0, de.elementProperties = /* @__PURE__ */ new Map(), de.elementStyles = [], de.shadowRootOptions = { mode: "open" }, At == null || At({ ReactiveElement: de }), ((Ge = Pe.reactiveElementVersions) !== null && Ge !== void 0 ? Ge : Pe.reactiveElementVersions = []).push("1.4.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var He;
const Re = window, ae = Re.trustedTypes, jt = ae ? ae.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Y = `lit$${(Math.random() + "").slice(9)}$`, Ft = "?" + Y, Sn = `<${Ft}>`, oe = document, ve = (n = "") => oe.createComment(n), _e = (n) => n === null || typeof n != "object" && typeof n != "function", Kt = Array.isArray, Tn = (n) => Kt(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", he = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Dt = /-->/g, xt = />/g, G = RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), St = /'/g, Tt = /"/g, qt = /^(?:script|style|textarea|title)$/i, Cn = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), Ct = Cn(1), ce = Symbol.for("lit-noChange"), S = Symbol.for("lit-nothing"), Et = /* @__PURE__ */ new WeakMap(), En = (n, e, t) => {
  var s, r;
  const i = (s = t == null ? void 0 : t.renderBefore) !== null && s !== void 0 ? s : e;
  let a = i._$litPart$;
  if (a === void 0) {
    const o = (r = t == null ? void 0 : t.renderBefore) !== null && r !== void 0 ? r : null;
    i._$litPart$ = a = new Ie(e.insertBefore(ve(), o), o, void 0, t != null ? t : {});
  }
  return a._$AI(n), a;
}, se = oe.createTreeWalker(oe, 129, null, !1), Zn = (n, e) => {
  const t = n.length - 1, s = [];
  let r, i = e === 2 ? "<svg>" : "", a = he;
  for (let c = 0; c < t; c++) {
    const u = n[c];
    let l, d, f = -1, A = 0;
    for (; A < u.length && (a.lastIndex = A, d = a.exec(u), d !== null); )
      A = a.lastIndex, a === he ? d[1] === "!--" ? a = Dt : d[1] !== void 0 ? a = xt : d[2] !== void 0 ? (qt.test(d[2]) && (r = RegExp("</" + d[2], "g")), a = G) : d[3] !== void 0 && (a = G) : a === G ? d[0] === ">" ? (a = r != null ? r : he, f = -1) : d[1] === void 0 ? f = -2 : (f = a.lastIndex - d[2].length, l = d[1], a = d[3] === void 0 ? G : d[3] === '"' ? Tt : St) : a === Tt || a === St ? a = G : a === Dt || a === xt ? a = he : (a = G, r = void 0);
    const k = a === G && n[c + 1].startsWith("/>") ? " " : "";
    i += a === he ? u + Sn : f >= 0 ? (s.push(l), u.slice(0, f) + "$lit$" + u.slice(f) + Y + k) : u + Y + (f === -2 ? (s.push(void 0), c) : k);
  }
  const o = i + (n[t] || "<?>") + (e === 2 ? "</svg>" : "");
  if (!Array.isArray(n) || !n.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [jt !== void 0 ? jt.createHTML(o) : o, s];
};
class Me {
  constructor({ strings: e, _$litType$: t }, s) {
    let r;
    this.parts = [];
    let i = 0, a = 0;
    const o = e.length - 1, c = this.parts, [u, l] = Zn(e, t);
    if (this.el = Me.createElement(u, s), se.currentNode = this.el.content, t === 2) {
      const d = this.el.content, f = d.firstChild;
      f.remove(), d.append(...f.childNodes);
    }
    for (; (r = se.nextNode()) !== null && c.length < o; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) {
          const d = [];
          for (const f of r.getAttributeNames())
            if (f.endsWith("$lit$") || f.startsWith(Y)) {
              const A = l[a++];
              if (d.push(f), A !== void 0) {
                const k = r.getAttribute(A.toLowerCase() + "$lit$").split(Y), P = /([.?@])?(.*)/.exec(A);
                c.push({ type: 1, index: i, name: P[2], strings: k, ctor: P[1] === "." ? On : P[1] === "?" ? Un : P[1] === "@" ? Ln : Qe });
              } else
                c.push({ type: 6, index: i });
            }
          for (const f of d)
            r.removeAttribute(f);
        }
        if (qt.test(r.tagName)) {
          const d = r.textContent.split(Y), f = d.length - 1;
          if (f > 0) {
            r.textContent = ae ? ae.emptyScript : "";
            for (let A = 0; A < f; A++)
              r.append(d[A], ve()), se.nextNode(), c.push({ type: 2, index: ++i });
            r.append(d[f], ve());
          }
        }
      } else if (r.nodeType === 8)
        if (r.data === Ft)
          c.push({ type: 2, index: i });
        else {
          let d = -1;
          for (; (d = r.data.indexOf(Y, d + 1)) !== -1; )
            c.push({ type: 7, index: i }), d += Y.length - 1;
        }
      i++;
    }
  }
  static createElement(e, t) {
    const s = oe.createElement("template");
    return s.innerHTML = e, s;
  }
}
function ue(n, e, t = n, s) {
  var r, i, a, o;
  if (e === ce)
    return e;
  let c = s !== void 0 ? (r = t._$Cl) === null || r === void 0 ? void 0 : r[s] : t._$Cu;
  const u = _e(e) ? void 0 : e._$litDirective$;
  return (c == null ? void 0 : c.constructor) !== u && ((i = c == null ? void 0 : c._$AO) === null || i === void 0 || i.call(c, !1), u === void 0 ? c = void 0 : (c = new u(n), c._$AT(n, t, s)), s !== void 0 ? ((a = (o = t)._$Cl) !== null && a !== void 0 ? a : o._$Cl = [])[s] = c : t._$Cu = c), c !== void 0 && (e = ue(n, c._$AS(n, e.values), c, s)), e;
}
class kn {
  constructor(e, t) {
    this.v = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  p(e) {
    var t;
    const { el: { content: s }, parts: r } = this._$AD, i = ((t = e == null ? void 0 : e.creationScope) !== null && t !== void 0 ? t : oe).importNode(s, !0);
    se.currentNode = i;
    let a = se.nextNode(), o = 0, c = 0, u = r[0];
    for (; u !== void 0; ) {
      if (o === u.index) {
        let l;
        u.type === 2 ? l = new Ie(a, a.nextSibling, this, e) : u.type === 1 ? l = new u.ctor(a, u.name, u.strings, this, e) : u.type === 6 && (l = new $n(a, this, e)), this.v.push(l), u = r[++c];
      }
      o !== (u == null ? void 0 : u.index) && (a = se.nextNode(), o++);
    }
    return i;
  }
  m(e) {
    let t = 0;
    for (const s of this.v)
      s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class Ie {
  constructor(e, t, s, r) {
    var i;
    this.type = 2, this._$AH = S, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = r, this._$C_ = (i = r == null ? void 0 : r.isConnected) === null || i === void 0 || i;
  }
  get _$AU() {
    var e, t;
    return (t = (e = this._$AM) === null || e === void 0 ? void 0 : e._$AU) !== null && t !== void 0 ? t : this._$C_;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = ue(this, e, t), _e(e) ? e === S || e == null || e === "" ? (this._$AH !== S && this._$AR(), this._$AH = S) : e !== this._$AH && e !== ce && this.$(e) : e._$litType$ !== void 0 ? this.T(e) : e.nodeType !== void 0 ? this.k(e) : Tn(e) ? this.O(e) : this.$(e);
  }
  S(e, t = this._$AB) {
    return this._$AA.parentNode.insertBefore(e, t);
  }
  k(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.S(e));
  }
  $(e) {
    this._$AH !== S && _e(this._$AH) ? this._$AA.nextSibling.data = e : this.k(oe.createTextNode(e)), this._$AH = e;
  }
  T(e) {
    var t;
    const { values: s, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = Me.createElement(r.h, this.options)), r);
    if (((t = this._$AH) === null || t === void 0 ? void 0 : t._$AD) === i)
      this._$AH.m(s);
    else {
      const a = new kn(i, this), o = a.p(this.options);
      a.m(s), this.k(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = Et.get(e.strings);
    return t === void 0 && Et.set(e.strings, t = new Me(e)), t;
  }
  O(e) {
    Kt(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, r = 0;
    for (const i of e)
      r === t.length ? t.push(s = new Ie(this.S(ve()), this.S(ve()), this, this.options)) : s = t[r], s._$AI(i), r++;
    r < t.length && (this._$AR(s && s._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var s;
    for ((s = this._$AP) === null || s === void 0 || s.call(this, !1, !0, t); e && e !== this._$AB; ) {
      const r = e.nextSibling;
      e.remove(), e = r;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$C_ = e, (t = this._$AP) === null || t === void 0 || t.call(this, e));
  }
}
class Qe {
  constructor(e, t, s, r, i) {
    this.type = 1, this._$AH = S, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = S;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e, t = this, s, r) {
    const i = this.strings;
    let a = !1;
    if (i === void 0)
      e = ue(this, e, t, 0), a = !_e(e) || e !== this._$AH && e !== ce, a && (this._$AH = e);
    else {
      const o = e;
      let c, u;
      for (e = i[0], c = 0; c < i.length - 1; c++)
        u = ue(this, o[s + c], t, c), u === ce && (u = this._$AH[c]), a || (a = !_e(u) || u !== this._$AH[c]), u === S ? e = S : e !== S && (e += (u != null ? u : "") + i[c + 1]), this._$AH[c] = u;
    }
    a && !r && this.P(e);
  }
  P(e) {
    e === S ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e != null ? e : "");
  }
}
class On extends Qe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  P(e) {
    this.element[this.name] = e === S ? void 0 : e;
  }
}
const zn = ae ? ae.emptyScript : "";
class Un extends Qe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  P(e) {
    e && e !== S ? this.element.setAttribute(this.name, zn) : this.element.removeAttribute(this.name);
  }
}
class Ln extends Qe {
  constructor(e, t, s, r, i) {
    super(e, t, s, r, i), this.type = 5;
  }
  _$AI(e, t = this) {
    var s;
    if ((e = (s = ue(this, e, t, 0)) !== null && s !== void 0 ? s : S) === ce)
      return;
    const r = this._$AH, i = e === S && r !== S || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, a = e !== S && (r === S || i);
    i && this.element.removeEventListener(this.name, this, r), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t, s;
    typeof this._$AH == "function" ? this._$AH.call((s = (t = this.options) === null || t === void 0 ? void 0 : t.host) !== null && s !== void 0 ? s : this.element, e) : this._$AH.handleEvent(e);
  }
}
class $n {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ue(this, e);
  }
}
const Zt = Re.litHtmlPolyfillSupport;
Zt == null || Zt(Me, Ie), ((He = Re.litHtmlVersions) !== null && He !== void 0 ? He : Re.litHtmlVersions = []).push("2.3.1");
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt = window.ShadowRoot && (window.ShadyCSS === void 0 || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, dt = Symbol(), kt = /* @__PURE__ */ new WeakMap();
class es {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== dt)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (lt && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = kt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && kt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
}
const Pn = (n) => new es(typeof n == "string" ? n : n + "", void 0, dt), Rn = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((s, r, i) => s + ((a) => {
    if (a._$cssResult$ === !0)
      return a.cssText;
    if (typeof a == "number")
      return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + n[i + 1], n[0]);
  return new es(t, n, dt);
}, Vn = (n, e) => {
  lt ? n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet) : e.forEach((t) => {
    const s = document.createElement("style"), r = window.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = t.cssText, n.appendChild(s);
  });
}, Ot = lt ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules)
    t += s.cssText;
  return Pn(t);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Je;
const zt = window.trustedTypes, Bn = zt ? zt.emptyScript : "", Ut = window.reactiveElementPolyfillSupport, at = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? Bn : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, e) {
  let t = n;
  switch (e) {
    case Boolean:
      t = n !== null;
      break;
    case Number:
      t = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(n);
      } catch {
        t = null;
      }
  }
  return t;
} }, ts = (n, e) => e !== n && (e == e || n == n), Fe = { attribute: !0, type: String, converter: at, reflect: !1, hasChanged: ts };
class q extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this.u();
  }
  static addInitializer(e) {
    var t;
    (t = this.h) !== null && t !== void 0 || (this.h = []), this.h.push(e);
  }
  static get observedAttributes() {
    this.finalize();
    const e = [];
    return this.elementProperties.forEach((t, s) => {
      const r = this._$Ep(s, t);
      r !== void 0 && (this._$Ev.set(r, s), e.push(r));
    }), e;
  }
  static createProperty(e, t = Fe) {
    if (t.state && (t.attribute = !1), this.finalize(), this.elementProperties.set(e, t), !t.noAccessor && !this.prototype.hasOwnProperty(e)) {
      const s = typeof e == "symbol" ? Symbol() : "__" + e, r = this.getPropertyDescriptor(e, s, t);
      r !== void 0 && Object.defineProperty(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    return { get() {
      return this[t];
    }, set(r) {
      const i = this[e];
      this[t] = r, this.requestUpdate(e, i, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) || Fe;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return !1;
    this.finalized = !0;
    const e = Object.getPrototypeOf(this);
    if (e.finalize(), this.elementProperties = new Map(e.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t = this.properties, s = [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)];
      for (const r of s)
        this.createProperty(r, t[r]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const r of s)
        t.unshift(Ot(r));
    } else
      e !== void 0 && t.push(Ot(e));
    return t;
  }
  static _$Ep(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  u() {
    var e;
    this._$E_ = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (e = this.constructor.h) === null || e === void 0 || e.forEach((t) => t(this));
  }
  addController(e) {
    var t, s;
    ((t = this._$ES) !== null && t !== void 0 ? t : this._$ES = []).push(e), this.renderRoot !== void 0 && this.isConnected && ((s = e.hostConnected) === null || s === void 0 || s.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$ES) === null || t === void 0 || t.splice(this._$ES.indexOf(e) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((e, t) => {
      this.hasOwnProperty(t) && (this._$Ei.set(t, this[t]), delete this[t]);
    });
  }
  createRenderRoot() {
    var e;
    const t = (e = this.shadowRoot) !== null && e !== void 0 ? e : this.attachShadow(this.constructor.shadowRootOptions);
    return Vn(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var e;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$ES) === null || e === void 0 || e.forEach((t) => {
      var s;
      return (s = t.hostConnected) === null || s === void 0 ? void 0 : s.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$ES) === null || e === void 0 || e.forEach((t) => {
      var s;
      return (s = t.hostDisconnected) === null || s === void 0 ? void 0 : s.call(t);
    });
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$EO(e, t, s = Fe) {
    var r, i;
    const a = this.constructor._$Ep(e, s);
    if (a !== void 0 && s.reflect === !0) {
      const o = ((i = (r = s.converter) === null || r === void 0 ? void 0 : r.toAttribute) !== null && i !== void 0 ? i : at.toAttribute)(t, s.type);
      this._$El = e, o == null ? this.removeAttribute(a) : this.setAttribute(a, o), this._$El = null;
    }
  }
  _$AK(e, t) {
    var s, r;
    const i = this.constructor, a = i._$Ev.get(e);
    if (a !== void 0 && this._$El !== a) {
      const o = i.getPropertyOptions(a), c = o.converter, u = (r = (s = c == null ? void 0 : c.fromAttribute) !== null && s !== void 0 ? s : typeof c == "function" ? c : null) !== null && r !== void 0 ? r : at.fromAttribute;
      this._$El = a, this[a] = u(t, o.type), this._$El = null;
    }
  }
  requestUpdate(e, t, s) {
    let r = !0;
    e !== void 0 && (((s = s || this.constructor.getPropertyOptions(e)).hasChanged || ts)(this[e], t) ? (this._$AL.has(e) || this._$AL.set(e, t), s.reflect === !0 && this._$El !== e && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(e, s))) : r = !1), !this.isUpdatePending && r && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var e;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((r, i) => this[i] = r), this._$Ei = void 0);
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), (e = this._$ES) === null || e === void 0 || e.forEach((r) => {
        var i;
        return (i = r.hostUpdate) === null || i === void 0 ? void 0 : i.call(r);
      }), this.update(s)) : this._$Ek();
    } catch (r) {
      throw t = !1, this._$Ek(), r;
    }
    t && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach((s) => {
      var r;
      return (r = s.hostUpdated) === null || r === void 0 ? void 0 : r.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$EC !== void 0 && (this._$EC.forEach((t, s) => this._$EO(s, this[s], t)), this._$EC = void 0), this._$Ek();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
}
q.finalized = !0, q.elementProperties = /* @__PURE__ */ new Map(), q.elementStyles = [], q.shadowRootOptions = { mode: "open" }, Ut == null || Ut({ ReactiveElement: q }), ((Je = globalThis.reactiveElementVersions) !== null && Je !== void 0 ? Je : globalThis.reactiveElementVersions = []).push("1.3.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Ke, qe;
class pe extends q {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e, t;
    const s = super.createRenderRoot();
    return (e = (t = this.renderOptions).renderBefore) !== null && e !== void 0 || (t.renderBefore = s.firstChild), s;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = En(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) === null || e === void 0 || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) === null || e === void 0 || e.setConnected(!1);
  }
  render() {
    return ce;
  }
}
pe.finalized = !0, pe._$litElement$ = !0, (Ke = globalThis.litElementHydrateSupport) === null || Ke === void 0 || Ke.call(globalThis, { LitElement: pe });
const Lt = globalThis.litElementPolyfillSupport;
Lt == null || Lt({ LitElement: pe });
((qe = globalThis.litElementVersions) !== null && qe !== void 0 ? qe : globalThis.litElementVersions = []).push("3.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yn = (n) => (e) => typeof e == "function" ? ((t, s) => (customElements.define(t, s), s))(n, e) : ((t, s) => {
  const { kind: r, elements: i } = s;
  return { kind: r, elements: i, finisher(a) {
    customElements.define(t, a);
  } };
})(n, e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wn = (n, e) => e.kind === "method" && e.descriptor && !("value" in e.descriptor) ? { ...e, finisher(t) {
  t.createProperty(e.key, n);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e.key, initializer() {
  typeof e.initializer == "function" && (this[e.key] = e.initializer.call(this));
}, finisher(t) {
  t.createProperty(e.key, n);
} };
function w(n) {
  return (e, t) => t !== void 0 ? ((s, r, i) => {
    r.constructor.createProperty(i, s);
  })(n, e, t) : Wn(n, e);
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var et;
((et = window.HTMLSlotElement) === null || et === void 0 ? void 0 : et.prototype.assignedElements) != null;
let be;
const Qn = new Uint8Array(16);
function Gn() {
  if (!be && (be = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !be))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return be(Qn);
}
const C = [];
for (let n = 0; n < 256; ++n)
  C.push((n + 256).toString(16).slice(1));
function Xn(n, e = 0) {
  return (C[n[e + 0]] + C[n[e + 1]] + C[n[e + 2]] + C[n[e + 3]] + "-" + C[n[e + 4]] + C[n[e + 5]] + "-" + C[n[e + 6]] + C[n[e + 7]] + "-" + C[n[e + 8]] + C[n[e + 9]] + "-" + C[n[e + 10]] + C[n[e + 11]] + C[n[e + 12]] + C[n[e + 13]] + C[n[e + 14]] + C[n[e + 15]]).toLowerCase();
}
const Hn = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), $t = {
  randomUUID: Hn
};
function Pt(n, e, t) {
  if ($t.randomUUID && !e && !n)
    return $t.randomUUID();
  n = n || {};
  const s = n.random || (n.rng || Gn)();
  if (s[6] = s[6] & 15 | 64, s[8] = s[8] & 63 | 128, e) {
    t = t || 0;
    for (let r = 0; r < 16; ++r)
      e[t + r] = s[r];
    return e;
  }
  return Xn(s);
}
const Jn = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNSAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF80Nl8yNTM4NCkiPgo8cGF0aCBkPSJNMTYuMTI0OSA3LjUxMzhDMTYuMjUzNyA3LjE2NTU1IDE2Ljc0NjMgNy4xNjU1NSAxNi44NzUxIDcuNTEzOEwxOC4zNTQzIDExLjUxMTNDMTguNTQ4OCAxMi4wMzY4IDE4Ljk2MzIgMTIuNDUxMiAxOS40ODg3IDEyLjY0NTdMMjMuNDg2MiAxNC4xMjQ5QzIzLjgzNDQgMTQuMjUzNyAyMy44MzQ0IDE0Ljc0NjMgMjMuNDg2MiAxNC44NzUxTDE5LjQ4ODcgMTYuMzU0M0MxOC45NjMyIDE2LjU0ODggMTguNTQ4OCAxNi45NjMyIDE4LjM1NDMgMTcuNDg4N0wxNi44NzUxIDIxLjQ4NjJDMTYuNzQ2MyAyMS44MzQ0IDE2LjI1MzcgMjEuODM0NCAxNi4xMjQ5IDIxLjQ4NjJMMTQuNjQ1NyAxNy40ODg3QzE0LjQ1MTIgMTYuOTYzMiAxNC4wMzY4IDE2LjU0ODggMTMuNTExMyAxNi4zNTQzTDkuNTEzOCAxNC44NzUxQzkuMTY1NTUgMTQuNzQ2MyA5LjE2NTU1IDE0LjI1MzcgOS41MTM4IDE0LjEyNDlMMTMuNTExMyAxMi42NDU3QzE0LjAzNjggMTIuNDUxMiAxNC40NTEyIDEyLjAzNjggMTQuNjQ1NyAxMS41MTEzTDE2LjEyNDkgNy41MTM4WiIgZmlsbD0iIzFDMUMxQyIvPgo8L2c+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIxX2RfNDZfMjUzODQpIj4KPHBhdGggZD0iTTcuNzY1NTQgMC42MzM2MjdDNy44NDYwOCAwLjQxNTk3MiA4LjE1MzkyIDAuNDE1OTcyIDguMjM0NDYgMC42MzM2MjZMOS4xNTg5NyAzLjEzMjA2QzkuMjgwNTEgMy40NjA1MiA5LjUzOTQ4IDMuNzE5NDkgOS44Njc5NCAzLjg0MTAzTDEyLjM2NjQgNC43NjU1NEMxMi41ODQgNC44NDYwOCAxMi41ODQgNS4xNTM5MiAxMi4zNjY0IDUuMjM0NDZMOS44Njc5NCA2LjE1ODk3QzkuNTM5NDggNi4yODA1MSA5LjI4MDUxIDYuNTM5NDggOS4xNTg5NyA2Ljg2Nzk0TDguMjM0NDYgOS4zNjYzN0M4LjE1MzkyIDkuNTg0MDMgNy44NDYwOCA5LjU4NDAzIDcuNzY1NTQgOS4zNjYzN0w2Ljg0MTAzIDYuODY3OTRDNi43MTk0OSA2LjUzOTQ4IDYuNDYwNTIgNi4yODA1MSA2LjEzMjA2IDYuMTU4OTdMMy42MzM2MyA1LjIzNDQ2QzMuNDE1OTcgNS4xNTM5MiAzLjQxNTk3IDQuODQ2MDggMy42MzM2MyA0Ljc2NTU0TDYuMTMyMDYgMy44NDEwM0M2LjQ2MDUyIDMuNzE5NDkgNi43MTk0OSAzLjQ2MDUyIDYuODQxMDMgMy4xMzIwNkw3Ljc2NTU0IDAuNjMzNjI3WiIgZmlsbD0iIzFDMUMxQyIvPgo8L2c+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIyX2RfNDZfMjUzODQpIj4KPHBhdGggZD0iTTQuMzEyNDMgMTYuNTA2OUM0LjM3Njg2IDE2LjMzMjggNC42MjMxNCAxNi4zMzI4IDQuNjg3NTcgMTYuNTA2OUw1LjQyNzE3IDE4LjUwNTZDNS41MjQ0MSAxOC43Njg0IDUuNzMxNTggMTguOTc1NiA1Ljk5NDM2IDE5LjA3MjhMNy45OTMxIDE5LjgxMjRDOC4xNjcyMiAxOS44NzY5IDguMTY3MjIgMjAuMTIzMSA3Ljk5MzEgMjAuMTg3Nkw1Ljk5NDM1IDIwLjkyNzJDNS43MzE1OCAyMS4wMjQ0IDUuNTI0NDEgMjEuMjMxNiA1LjQyNzE3IDIxLjQ5NDRMNC42ODc1NyAyMy40OTMxQzQuNjIzMTQgMjMuNjY3MiA0LjM3Njg2IDIzLjY2NzIgNC4zMTI0MyAyMy40OTMxTDMuNTcyODMgMjEuNDk0NEMzLjQ3NTU5IDIxLjIzMTYgMy4yNjg0MiAyMS4wMjQ0IDMuMDA1NjUgMjAuOTI3MkwxLjAwNjkgMjAuMTg3NkMwLjgzMjc3NyAyMC4xMjMxIDAuODMyNzc3IDE5Ljg3NjkgMS4wMDY5IDE5LjgxMjRMMy4wMDU2NSAxOS4wNzI4QzMuMjY4NDIgMTguOTc1NiAzLjQ3NTU5IDE4Ljc2ODQgMy41NzI4MyAxOC41MDU2TDQuMzEyNDMgMTYuNTA2OVoiIGZpbGw9IiMxQzFDMUMiLz4KPC9nPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9kXzQ2XzI1Mzg0IiB4PSI4LjYxMjYyIiB5PSI2LjYxMjkzIiB3aWR0aD0iMTUuNzc0OCIgaGVpZ2h0PSIxNS43NzQ2IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQvPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIwLjMyIi8+CjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4yNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzQ2XzI1Mzg0Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzQ2XzI1Mzg0IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8ZmlsdGVyIGlkPSJmaWx0ZXIxX2RfNDZfMjUzODQiIHg9IjMuMDcwNCIgeT0iMC4wNzA3MDMyIiB3aWR0aD0iOS44NTkyIiBoZWlnaHQ9IjkuODU4NTkiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldC8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjAuMiIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd180Nl8yNTM4NCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvd180Nl8yNTM4NCIgcmVzdWx0PSJzaGFwZSIvPgo8L2ZpbHRlcj4KPGZpbHRlciBpZD0iZmlsdGVyMl9kXzQ2XzI1Mzg0IiB4PSIwLjU1NjI4MiIgeT0iMTYuMDU2IiB3aWR0aD0iNy44ODc0NCIgaGVpZ2h0PSI3Ljg4NzU2IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQvPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIwLjE2Ii8+CjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4yNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzQ2XzI1Mzg0Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzQ2XzI1Mzg0IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8L2RlZnM+Cjwvc3ZnPgo=", Fn = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNSAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF80Nl8yNTIwOSkiPgo8cGF0aCBkPSJNMTYuMTI0OSA3LjUxMzhDMTYuMjUzNyA3LjE2NTU1IDE2Ljc0NjMgNy4xNjU1NSAxNi44NzUxIDcuNTEzOEwxOC4zNTQzIDExLjUxMTNDMTguNTQ4OCAxMi4wMzY4IDE4Ljk2MzIgMTIuNDUxMiAxOS40ODg3IDEyLjY0NTdMMjMuNDg2MiAxNC4xMjQ5QzIzLjgzNDQgMTQuMjUzNyAyMy44MzQ0IDE0Ljc0NjMgMjMuNDg2MiAxNC44NzUxTDE5LjQ4ODcgMTYuMzU0M0MxOC45NjMyIDE2LjU0ODggMTguNTQ4OCAxNi45NjMyIDE4LjM1NDMgMTcuNDg4N0wxNi44NzUxIDIxLjQ4NjJDMTYuNzQ2MyAyMS44MzQ0IDE2LjI1MzcgMjEuODM0NCAxNi4xMjQ5IDIxLjQ4NjJMMTQuNjQ1NyAxNy40ODg3QzE0LjQ1MTIgMTYuOTYzMiAxNC4wMzY4IDE2LjU0ODggMTMuNTExMyAxNi4zNTQzTDkuNTEzOCAxNC44NzUxQzkuMTY1NTUgMTQuNzQ2MyA5LjE2NTU1IDE0LjI1MzcgOS41MTM4IDE0LjEyNDlMMTMuNTExMyAxMi42NDU3QzE0LjAzNjggMTIuNDUxMiAxNC40NTEyIDEyLjAzNjggMTQuNjQ1NyAxMS41MTEzTDE2LjEyNDkgNy41MTM4WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZyBmaWx0ZXI9InVybCgjZmlsdGVyMV9kXzQ2XzI1MjA5KSI+CjxwYXRoIGQ9Ik03Ljc2NTU0IDAuNjMzNjI3QzcuODQ2MDggMC40MTU5NzIgOC4xNTM5MiAwLjQxNTk3MiA4LjIzNDQ2IDAuNjMzNjI2TDkuMTU4OTcgMy4xMzIwNkM5LjI4MDUxIDMuNDYwNTIgOS41Mzk0OCAzLjcxOTQ5IDkuODY3OTQgMy44NDEwM0wxMi4zNjY0IDQuNzY1NTRDMTIuNTg0IDQuODQ2MDggMTIuNTg0IDUuMTUzOTIgMTIuMzY2NCA1LjIzNDQ2TDkuODY3OTQgNi4xNTg5N0M5LjUzOTQ4IDYuMjgwNTEgOS4yODA1MSA2LjUzOTQ4IDkuMTU4OTcgNi44Njc5NEw4LjIzNDQ2IDkuMzY2MzdDOC4xNTM5MiA5LjU4NDAzIDcuODQ2MDggOS41ODQwMyA3Ljc2NTU0IDkuMzY2MzdMNi44NDEwMyA2Ljg2Nzk0QzYuNzE5NDkgNi41Mzk0OCA2LjQ2MDUyIDYuMjgwNTEgNi4xMzIwNiA2LjE1ODk3TDMuNjMzNjMgNS4yMzQ0NkMzLjQxNTk3IDUuMTUzOTIgMy40MTU5NyA0Ljg0NjA4IDMuNjMzNjMgNC43NjU1NEw2LjEzMjA2IDMuODQxMDNDNi40NjA1MiAzLjcxOTQ5IDYuNzE5NDkgMy40NjA1MiA2Ljg0MTAzIDMuMTMyMDZMNy43NjU1NCAwLjYzMzYyN1oiIGZpbGw9IndoaXRlIi8+CjwvZz4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjJfZF80Nl8yNTIwOSkiPgo8cGF0aCBkPSJNNC4zMTI0MyAxNi41MDY5QzQuMzc2ODYgMTYuMzMyOCA0LjYyMzE0IDE2LjMzMjggNC42ODc1NyAxNi41MDY5TDUuNDI3MTcgMTguNTA1NkM1LjUyNDQxIDE4Ljc2ODQgNS43MzE1OCAxOC45NzU2IDUuOTk0MzYgMTkuMDcyOEw3Ljk5MzEgMTkuODEyNEM4LjE2NzIyIDE5Ljg3NjkgOC4xNjcyMiAyMC4xMjMxIDcuOTkzMSAyMC4xODc2TDUuOTk0MzUgMjAuOTI3MkM1LjczMTU4IDIxLjAyNDQgNS41MjQ0MSAyMS4yMzE2IDUuNDI3MTcgMjEuNDk0NEw0LjY4NzU3IDIzLjQ5MzFDNC42MjMxNCAyMy42NjcyIDQuMzc2ODYgMjMuNjY3MiA0LjMxMjQzIDIzLjQ5MzFMMy41NzI4MyAyMS40OTQ0QzMuNDc1NTkgMjEuMjMxNiAzLjI2ODQyIDIxLjAyNDQgMy4wMDU2NSAyMC45MjcyTDEuMDA2OSAyMC4xODc2QzAuODMyNzc3IDIwLjEyMzEgMC44MzI3NzcgMTkuODc2OSAxLjAwNjkgMTkuODEyNEwzLjAwNTY1IDE5LjA3MjhDMy4yNjg0MiAxOC45NzU2IDMuNDc1NTkgMTguNzY4NCAzLjU3MjgzIDE4LjUwNTZMNC4zMTI0MyAxNi41MDY5WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9kXzQ2XzI1MjA5IiB4PSI4LjYxMjYyIiB5PSI2LjYxMjkzIiB3aWR0aD0iMTUuNzc0OCIgaGVpZ2h0PSIxNS43NzQxIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQvPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIwLjMyIi8+CjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4yNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzQ2XzI1MjA5Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzQ2XzI1MjA5IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8ZmlsdGVyIGlkPSJmaWx0ZXIxX2RfNDZfMjUyMDkiIHg9IjMuMDcwNCIgeT0iMC4wNzA3MDMyIiB3aWR0aD0iOS44NTkyIiBoZWlnaHQ9IjkuODU4NTkiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldC8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjAuMiIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd180Nl8yNTIwOSIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvd180Nl8yNTIwOSIgcmVzdWx0PSJzaGFwZSIvPgo8L2ZpbHRlcj4KPGZpbHRlciBpZD0iZmlsdGVyMl9kXzQ2XzI1MjA5IiB4PSIwLjU1NjI4MiIgeT0iMTYuMDU2IiB3aWR0aD0iNy44ODc0NCIgaGVpZ2h0PSI3Ljg4ODA1IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQvPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIwLjE2Ii8+CjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4yNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzQ2XzI1MjA5Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzQ2XzI1MjA5IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8L2RlZnM+Cjwvc3ZnPgo=", Kn = Rn`
  :host(#just-frame-payment) {
    position: absolute;
    width: 70%;
    height: 80%;
    background-color: #fff;
    box-shadow: 3px 6px 38px -3px rgba(0, 0, 0, 0.73);
    border: 1px solid transparent;
    top: 40px;
  }

  .just-button-label-logo-container {
    display: flex;
    align-items: center;
    position: relative;
  }

  .just-button-logo {
    position: absolute;
    right: -30px;
  }

  .just-btn {
    font-weight: 700;
    box-sizing: border-box;
    text-transform: uppercase;
    font-family: inherit;
    justify-content: center;
    background-color: #050505;
    background-size: contain;
    background-repeat: no-repeat;
    border: none;
    color: #fff;
    text-align: center;
    text-decoration: none;
    display: flex;
    align-items: center;
    font-size: 0.9em;
    border-radius: 0.5em;
    min-width: 250px;
    cursor: pointer;
    width: 100%;
    height: 55px;
    transition: background-color 0.4s;
    padding: 2px 6px !important;
  }

  .just-btn:hover {
    background-color: ##1c1c1c;
  }

  .just-btn:active {
    background-color: #282525;
  }

  .just-btn-yellow {
    background-color: #ffa908;
    color: #1c1c1c;
  }

  .just-btn-yellow:hover {
    background-color: #ffd587;
  }

  .just-btn-yellow:active {
    background-color: #ffd587;
  }

  .just-btn-white {
    background-color: #fff !important;
    color: #000;
  }

  .just-btn-purple {
    background-color: #7866ff !important;
  }
  .just-btn-purple:hover {
    background-color: #5346b6 !important;
  }

  .just-btn.just-btn-created {
    background-color: #416a17 !important;
  }
  .just-btn.just-btn-cancelled {
    background-color: #e83a33 !important;
  }

  .just-backdrop {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-weight: 400;
    color: #fff;
    z-index: 9999;
  }
  .just-backdrop .logo {
    margin: 0 auto;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANQAAAAtCAYAAADWQ0XJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA6aSURBVHgB7V0JkCNVGf7SnUzm2p1hYeRYdccVFJcSwUUUBS/UEm9U1BK1sCzL+y4PqjxLtASrpBQFD/DCGxRRS0UpWTwQFkRuhEV2OJdldUGXGXZmkm7+L++9pKc3mUn//XaSUPmq/ulMp5O8dPp///W9v4E++uijjz766KOPPh7mKMAvCuvWrStt27ZtYHZ2dqBcLg9UKpWBKIpK1Wp1II7jskhRZMBt5TVFOabErRM5NpRtmGN8D4icK3K4yNORHf8X+Tb84VCRZyE7HhT5pkiMbOB5mxQ5TGR/kX1F1ojsI7KXyCqRUZjznUZVZAfMOfiPyL0id4r8S+RakatFtiI7DhZ5LnoT/xU5u50DfStUuHr16vH5+fnxIKiuiiKMybUwVqlUx6OosFIUS7bVlaJIK6IoHovjaDSOMSr75f9oRPZThuV9Bq2yacf3S5FjRc4TeQWy49ciL4M//FDk9ciOC0We38ZxIyJHwHzXI2GUaAS7D9tELhX5qcjvRLa38RpOUG9Gb+JnIq9t58AiPGJycrI0MzNTLBYjsTqhWKCKWBvIllKzSPJ5BRFuEcr+0OyLnUWiBLIvQD5lv8xu94UOl8EvngAdLsfS73uCyHEij8HyYULkpVZorU4VOU1kpsXx/C0PR+/ignYPDOAR09PTxVKpUoqiolWgoBgEVJig7s4BUbhQgeKAimX/D5DP1XPYKEJLp73INsIf9hR5InS4pMX+1SJfghnnR7C8ypTG3iJfELlO5IAWx+wn8lj0Lq5u90CfChWIqycWaYAxUCkMY2eVSiLWEtWUpSiuoLVWxnphoTIFyDcuxh1XiTxe5BHQ4Z/wB8YOGk9gXuTKJvs/AHPxcjuK7gGVegOau7aHiAyiN0H3tjMKNTQ0RGUqhmEkViqqWyl5rpZ0MP/XLVNdyazChcbVy+3ubYLx6Q+DDi4Y94VJ6LBZ5O7E/zwndK1omcbRnaAl+ipMEiaJZ6J3QS+h0u7B3hRK4qeiWKgS4ydJONSUh+5eHFcT8VMjk9ewTOn4CXkVyrlrT4EOS8UtWaFV7PQ4viLyfnQ/9hA5KbXvaehd/D3Lwd4UysRPJcZP4uIxIRHS1SvZ+MkqjFG2xv9xuBvip0vte2jS5cTf4BfacdyYePwOkXejd3C0yAr7mNsnoXeRKZ72pVDByMiIc/fqFslk96qhUax6rCT7Imel6oplLVXe+ImYggmUtYH6pfAHxnAHQIer7JYJiI+jt1BGI91/oMgYehOMY6eyvMCLQq1fvz7cuXMn7VORRdwgiKyLV8/whVSiRAKCz4eox0/G1fOQLmcB9CaYdPIwsoOvvxb+sA66ehDHcY19/HaY2KTX4LJ62tJFN+A2kTuyvMCLQm3durVYLrPmJBFUFCbipwX1pzBRfwoSVmlBDIV8uAWmqv9U6HCzfb0vaGMHjoM/5BB6txjqJpLnoHdB97/thATho7BbEOtk46dqySgQ46cKrVMtbjKfw8yfsU6AK/YiEU95cfdcIH8EdLgCfvEM6LAx8frV0IHvcSZMkZr0oQesNANT2ithKEmkJ9HCHyPyYuh/E5cpPRK9iz8jI7wwJUSXyP+aCcO5wtyc/CkUpqOocJ+4f0NWxP0qlAsFDInCUeRxPCgKNWjjq7KlGlGxuD3ObrPicvudngwdfMZPHMd66OCYGtqJga7KUSJzbR6/0woVj5y9DSJniLwchsalAS0slXEK+aw+GRYal5f1o7wJpj8gI3woVLxlyxZSTig+6jcshB4PHahQJIFq/XafFopJkX2gg7NQWsoSLRHPA2tZmVyWFHhBfRk6cHKKYCbHPGAsqVGor4t8EssMr1w+T9CmmadhmAUvgbF0WUGG9VXwB1oXTYJle2Ice0OHg2AszT0wXDuypalk/xOZhZn87rePH7T7ef7ugylsb7dbHtfJ2hcV6SDo8Cd0AN2oUNq4g9k5XhxahSS9ZCf8QeuucRzz9nHWZRtJ0N3aD/oMId1FTjJUMrps/xa5Hob2RIXfht0PUpY0MRzHfR06gG5TKFoWLcPBpZm1bpLPdDmhjeOSDIl70Dkwht3Tyv4iz048R8tFviOXx3BpQ6bUcgYcBR1YFPdJH+tZ0O+nzx8r5HX2PW5Wvv498AfSb2aU43hR4n3epHyP5RRadS7mPBD+cYlyTKeijxoYwGp/WDISJnK83ieBc32OceyVeB8q5lSO91pO4QRyNPyBbIudyrG8Eh1C2uXjcgAtmXMD8uNx0IFBNFnmx0AHxl4+XT7t2h8WppOuCuOXD4l8Hzrmx3KCRegfwSxzvx75wWxvGdlBD8f3AlE1uMZGMyNshh+cr/x8l9H5rPL1ba93aRNnKcfxmxbv9waYLF3cA/Jb+MHxys+/Af5bO7SNdAZlHXTwEZSySq8NQm+w24Ohw+3wB86qWrpNq0LkD2DSxz9GvrrScoBu3xrkhzZby1pijA4hrVD7QwcfM8JrYGIGDX5lt49E58HmMFqm+0WLPEf2A1fDMj77IkxWM0L3gdlBLcM+CW0PihvRRWAxUGNmmd7No1RkFNym/GzWQ1ba99mqfA/6/BqqUxpMKGxWjuGGjGPgZLgWRsk+JvIdGNf3Vpg6VtxB0XSaSoLncVr52R1tVVZMPdb2KGBFn26OtjrNdlSPhg7nwFT1CW0PCSZD6GJsgB6cUH4B/ZJ3thprl3tH0DrdaqXZWJjx5PngxclFfmN2S6XlBFSyWyYTyAxnvYlL62nlVyPfBJnlezQDrbAmCdPxhERaoTSUHYdTRF6A9nq0OVCBGRfkSVmfifzgd2evhhfCEESzYg1MJk4bA/IC/K59/CnoekaQxHqxfcyZ+l7ovgsxCVPL0VqaW5EPWrYMk0vT6CCSCkXtzjOzcFbZIPIJmGr/3S2O42zIGfDVIh9GvoYjpNdfCT9gYxHGJZ8T+SMM1Wa+xbE8b7QAVCRmo7hEPc9kxEnlLpgJhoRODd2GFuVi+MEUTMZVo1BU4s3IB61C/RV2OdDk5GTAtgyVSiWMoiigcDGrbJNNgdyyoYJb8Aqz6NUtdK09Pz8/75YWFRJbXiv3pweQNuukkxyC/GBdh/EYZ6oddh8vwkfB1Gj2Rb4LkOAEQL5ckiHOH3MC+cHlKOSv8cLgxOAmGn4HukaTMK7RCuQHlZYsA54rTkpaxjutEq316TAx4Tx0oCtI9/db0CUXfg4zWWrBc8rzviey49i1a/e4aG4uGI3jwkgUYbRSKcgEXh2pVjFSKESyLx42z0XDplNxla7lULUac6IfiuNIpL7l8qJB20J8UE7xgOwr24ZDzLpuSg8gXdjlj+pDoeiXH4pd20n5BJcWpC8+FkZ9KBSVfQ38pH+XAl1F5yLlUVBOjm+1wkQNzwUvTMcc56TAWpZLu/NCcmvQ+LmMtThJMEPJiU+7sPAnyAdyMTXKFJfL5evn5kZC1xs/jufCMERYqQSyjWQ/v2vAdgyJVeJBYP+vWSHbdctaobhgrZW1YnXrRO9lU7NBpBWKdZCO0TYygMsNTmyyn+PXsrw7AVrBT8M/Jqws97lgprbttsUtoGXq3DQxMXGnuHijCffNtlooBGbfgi5b9vnI7XOKE9g+J4n9daVyCjXVahDpWej3MGtkuh1vQ4NdnsT56B3wPL8KC1ezZknodCM+j4aLr4WWD3jJ7OysWKMKGwWFptFqrb9J6BqsOmVqxFBRzWIVCq5hUJRux7CL1bIWq2XcnlYoxj2++9L5xskwafZm4Nh98MiWA6R5pXu+sWNTL0xozUC2Sd6MKz0mbYOdjStWVEJx+8JSyXQhXph8cBZqgfWiuycJi7rCNLNIzmolExItdSStUKxtnIzuBXliJy7yPAPzs9D94Dk+o8l+KtOF6D0wAcKlJnmZG4zdVAsiS6XSZYyfjHUqhsWiU6bQdSSWbZhUkrrrFwS7WCKnfGnFKtjv2rK7cLPAk8H+ueguUFFOgrl9ylI8LfZAOA/dCaZZ3wvDbGiFz6C3QDeV6XUfKXtmgDUF5R3j4+O3mJtVVK0iFUVRjFKZO8DwcTXdtk6Uj6l0d1ulevxUaChXUqlqjxlqtFyt3CqT80b4b6mlBRMQ74Opb7UzA/IYti2+Bt0FBuxcXnLaEsdx9jsFvQFSvdiI0xfDXOvubRJFCgYHq+HAQKPWBLjYyFmfIBk/1ZTEWaeG4sQJ16/2urqrZx//Y7GBtFIoLuwilaiT7gct0UUiz8PSF2EarB3x4u2GdTGs3H8Dpullu23KPgpTB+pm0CKRGXIO/EHbw++K0dFRSUiUQ3YDb7h7se1GvCB+coqT7qu/wBIl3b1E/ERZjMC8aK2BNQs2OmTMcheWF/yxyD7ncnCtpaRSseL+QbRmbexOsO7zNRg6FmfxrP0h3inyLph6UjeBFxRXVjMbtwn+wAtb1cdQikwXi7u3CwuCWT7WoUyGL0jekCL5uLa1Ll6YiKOaxU+s4S1684B2/VWywU+Acb20veaWAn1xZu8YrPtumMJCMy/qE6BfM9UOaFXpspFKxJtNzyA/SEdy9KZO3cWCqf3vwRB4d9fyCH43TRu3imT2DhobG2NoQLbDqJHqsGVH8B7Ow1FUqN2/mcL7OaPGiqjKYwzb5quD9nnHjmA33bJlSQxYlgQL8Is2AcoaAFKjSWQltYTrVUi/GIIOtIDUdt5/5wK73d2L5/h92VWJd4agu8IZcS/owYwPU91/gZkEyDbX3CG9XZDFQItHN3gt9HdHXAx0UfldGIMyXmB85LPfeytwwjgd2bF51apVh4yMNOhG8/NUJNKNDO3I0o1GLd2ItCLZH4vC1W6QnqAZ8fka3WjIKlKZBAzZN2A7HJ8t8pbFBpN3YSC1mHyvSRjCKykjVLD0j8yYjD8U3Z7bYag2d6DzoClnqpZLRzh+Wl+SdZvdvpLKTgoP+zy47zAFPWfOBxw/kqlm8iO56pmLNPkbcOVwq9+X6XnyFekVMPPIRph066fQWArTRx999NFHH308bPAQcs3JnyaKKKkAAAAASUVORK5CYII=');
    background-size: contain;
    background-repeat: no-repeat;
    width: 106px;
    height: 23px;
  }
  .just-backdrop a {
    color: #fff;
  }
  .just-backdrop .message {
    text-align: center;
  }

  .just-btn::part(base) {
    background: transparent;
    border: none;
  }

  .just-btn::part(base):hover {
    color: whitesmoke;
  }
  .just-payment-indication {
    font-size: 0.8rem;
  }
  .just-button-label-container {
    display: flex;
    flex-direction: column;
    font-family: inherit;
  }
`, Rt = "https://checkout-form-shopify-redesign.vercel.app", qn = (n) => {
  const e = sessionStorage.getItem(`just_${n}`);
  return e ? JSON.parse(e) : null;
};
function we(n) {
  sessionStorage.removeItem(`just_${n}`);
}
var er = Object.defineProperty, tr = Object.getOwnPropertyDescriptor, b = (n, e, t, s) => {
  for (var r = s > 1 ? void 0 : s ? tr(e, t) : e, i = n.length - 1, a; i >= 0; i--)
    (a = n[i]) && (r = (s ? a(e, t, r) : a(r)) || r);
  return s && r && er(e, t, r), r;
};
let N = class extends pe {
  constructor(n, e, t, s = "default", r, i, a, o = "quantity") {
    super(), this.language = null, this.fetchPromoCode = null, this.theme = "default", this.connection_status = "online", this.quantity_selector = "quantity", this.variant_id_event = null, this.classes = {
      IDLE: "",
      PENDING: "just-btn-pending",
      CANCELLED: "just-btn-cancelled",
      CREATED: "just-btn-created",
      ERROR: "just-btn-error"
    }, this.showButton = !0, this.current_clicked = null, this.translations = {
      fr: {
        IDLE: "Acheter en 1-clic",
        PENDING: "Acheter en 1-clic",
        ERROR: "Acheter en 1-clic",
        CANCELLED: "Commande annul\xE9e",
        CREATED: "Modifier ma commande",
        PAYMENT_INDICATION: "Paiement par carte seulement"
      },
      en: {
        IDLE: "Buy Now with 1-Click",
        PENDING: "Buy Now with 1-Click",
        ERROR: "Buy Now with 1-Click",
        CANCELLED: "Order canceled",
        CREATED: "Edit order",
        PAYMENT_INDICATION: "Payment by cards only"
      }
    }, this.features = {
      payment_indication: !1,
      disable_button_status: !1,
      disable_button: !1
    }, this._setTimer = () => {
      if (this.features.disable_button_status)
        return;
      const c = this._getCurrentSession();
      if (c) {
        const u = We(c == null ? void 0 : c.expiration, new Date());
        if (u <= 0) {
          we(c == null ? void 0 : c.sessionKey), this._setState({ command_status: "IDLE", request_status: "IDLE" }), this.timer_iterval && (clearInterval(this.timer_iterval), this.timer = void 0);
          return;
        }
        if (c.command_status === "CREATED") {
          this.timer_iterval = setInterval(() => {
            const l = wn({
              start: new Date().getTime(),
              end: c.expiration
            }), d = l.seconds && l.seconds < 10 ? `0${l.seconds}` : l.seconds;
            this.timer = l.minutes ? `${l.minutes}:${d}` : d == null ? void 0 : d.toString();
          }), setTimeout(() => {
            clearInterval(this.timer_iterval), we(this._getSessionKey()), this.timer = void 0, this._setState({
              request_status: "IDLE",
              command_status: "IDLE"
            });
          }, u);
          return;
        }
        we(this._getSessionKey()), this.timer_iterval && (clearInterval(this.timer_iterval), this.timer = void 0);
        return;
      }
      this.timer_iterval && clearInterval(this.timer_iterval), this.timer = void 0;
    }, this._setState = (c) => {
      this.state = {
        ...this.state,
        ...c
      };
    }, this._toKeyValue = (c) => {
      var u;
      if (!!c)
        return (u = Object.keys(c)) == null ? void 0 : u.map((l) => {
          var d;
          return {
            key: l,
            value: (d = c == null ? void 0 : c[l]) == null ? void 0 : d.toString()
          };
        });
    }, this._transformData = (c) => this.source === "cart" ? c.items.map((u) => ({
      quantity: u.quantity,
      variantId: u.variant_id,
      customAttributes: this._toKeyValue(u == null ? void 0 : u.properties),
      price: u == null ? void 0 : u.price
    })) : this.source === "product-form" ? c.items.map((u) => ({
      quantity: u.quantity,
      variantId: u.variantId,
      customAttributes: this._toKeyValue(u == null ? void 0 : u.properties)
    })) : this.source === "custom" ? c : this.source === "customV2" ? c.items.map((u) => ({
      quantity: u.quantity,
      variantId: u.variantId,
      customAttributes: this._toKeyValue(u == null ? void 0 : u.properties)
    })) : [
      {
        quantity: c.quantity,
        variantId: parseInt(this._getVariantId(), 10),
        price: c == null ? void 0 : c.price
      }
    ], this._getFetchFn = () => {
      switch (this.source) {
        case "product":
          return qs.bind(this, this.quantity_selector, this._getVariantId());
        case "cart":
          return gt;
        case "product-form":
          return en.bind(this, this.product_id);
        case "custom":
          return window.JUST_CUSTOM_FN;
        case "customV2":
          return window.JUST_CUSTOMV2_FN;
        case "collections":
          return tn.bind(this, this.handle, this.quantity_selector);
        default:
          throw new Error("No source specified");
      }
    }, this._getVariantId = () => {
      var f, A, k;
      const { searchParams: c } = new URL(window.location.href), u = c.get("variant"), l = this.state.data;
      return (k = (A = (f = this == null ? void 0 : this.variant_id_event) != null ? f : u) != null ? A : this.default_variant) != null ? k : l == null ? void 0 : l.id;
    }, this._getSessionKey = () => {
      var c;
      if (this.source === "product")
        return this._getVariantId();
      if (this.source === "collections")
        return this.default_variant;
      if (this.source === "cart") {
        const u = this.state.data;
        return btoa(unescape(encodeURIComponent(JSON.stringify(u))));
      } else {
        if (this.source === "product-form")
          return this.product_id;
        if (this.source === "custom" || this.source === "customV2")
          return btoa(unescape(encodeURIComponent(JSON.stringify((c = this.custom_data) != null ? c : {}))));
      }
      return null;
    }, this.getCurrentSavedSession = () => localStorage.getItem("just_session_id"), this._getCurrentSession = () => {
      const c = this._getSessionKey();
      return c ? qn(c.toString()) : null;
    }, this._frameListenner = (c) => {
      var ht, pt;
      if (!["http://localhost:3000", Rt].some((Ne) => c.origin.includes(Ne)))
        return;
      const d = typeof c.data == "string" ? JSON.parse(c.data) : c.data, f = this._getCurrentSession(), A = !!document.getElementById("just-frame-overlay"), P = (() => {
        if (A)
          return document.getElementById("just-frame-overlay");
        const Ne = document.createElement("div");
        return Ne.id = "just-frame-overlay", Ne;
      })();
      d.ready && d.emitter === "JUST_FORM" && (this.current_clicked === this._getVariantId() && this.state.command_status !== "ERROR" && this.state.data && (this._postMessage({
        ...this.state,
        sessionKey: (ht = this._getSessionKey()) != null ? ht : null,
        currentCheckoutSessionId: (pt = this.getCurrentSavedSession()) != null ? pt : null,
        requestId: f == null ? void 0 : f.requestId,
        automaticRedirect: this.automatic_redirect,
        source: this.source
      }), document.body.style.overflow = "hidden", document.body.prepend(P)), this.current_clicked = null), d.command_status === "CREATED" && d.emitter === "JUST_FORM" ? (document.body.style.overflow = "auto", d.sessionKey === this._getSessionKey() && (this._setState({
        request_status: "IDLE",
        command_status: this.features.disable_button_status ? "IDLE" : d.command_status
      }), this.timer_iterval && clearInterval(this.timer_iterval), this._setTimer())) : d.command_status === "CANCELLED" && d.emitter === "JUST_FORM" && (localStorage.removeItem("just_session_id"), document.body.style.overflow = "auto", d.sessionKey === this._getSessionKey() && (this._setState({
        request_status: "IDLE",
        command_status: d.command_status
      }), this.timer_iterval && d.sessionKey === this._getSessionKey() && clearInterval(this.timer_iterval), this.timer = void 0), we(d.sessionKey)), d.emitter === "JUST_FORM" && d.action === "CLOSE" && (this._derivedAnalytics(d), document.body.style.overflow = "auto", P.remove(), this._removeIframe(), d.command_status === "CREATED" && (window.location.href = d.orderUrl)), d.emitter === "JUST_FORM" && d.action === "SET_SESSION_ID" && localStorage.setItem("just_session_id", d.checkoutSessionId), d.emitter === "JUST_FORM" && d.action === "NAVIGATE" && (this._derivedAnalytics(d), window.location.href = d.orderUrl), d.emitter === "JUST_FORM" && d.action === "CLEAR_SESSION_ID" && localStorage.removeItem("just_session_id");
    }, this.language = rn.call(this), this.app_id = n, this.domain = e, this.source = t, this.theme = s, this.handle = r, this.default_available = a, this.default_variant = i, this.quantity_selector = o, this.state = {
      command_status: "IDLE",
      request_status: "IDLE",
      store: "shopify"
    };
  }
  async connectedCallback() {
    super.connectedCallback(), window.addEventListener("offline", () => {
      this.connection_status = "online";
    }), window.addEventListener("change", async () => {
      this._getCurrentSession() || this._setState({
        command_status: "IDLE"
      }), this._setTimer();
    }), window.addEventListener("online", () => {
      this.connection_status = "offline";
    }), window.addEventListener("message", this._frameListenner, !1);
    let n = location.href;
    if (new MutationObserver(() => {
      const e = location.href;
      e !== n && (n = e, this.onUrlChange());
    }).observe(document, {
      subtree: !0,
      childList: !0
    }), this.source === "product-form") {
      const e = (r) => {
        var i;
        for (const a of r)
          a.type === "attributes" && this.onVariantChange((i = a == null ? void 0 : a.target) == null ? void 0 : i.value);
      }, t = document.querySelector(`#product_form_${this.product_id} [name="id"]`);
      if (!t)
        return;
      new MutationObserver(e).observe(t, { attributes: !0 });
    }
  }
  disconnectedCallback() {
    window.removeEventListener("message", this._frameListenner, !1), window.removeEventListener("online", () => {
      this.connection_status = "online";
    }), window.removeEventListener("change", () => {
      this.requestUpdate(), this._setTimer();
    }), window.removeEventListener("offline", () => {
      this.connection_status = "offline";
    }), super.disconnectedCallback();
  }
  async firstUpdated() {
    const n = "payment_indication", e = "disable_button_status", t = "disable_button", [s, r, i] = await Promise.all(
      [n, e, t].map(
        async (a) => {
          var o;
          return await Xs(a, { origin: (o = window.location) == null ? void 0 : o.host });
        }
      )
    );
    if (this.features[n] = s != null ? s : !1, this.features[e] = r != null ? r : !1, this.features[t] = i != null ? i : !1, this.source === "cart") {
      const a = await gt();
      this._setState({ data: this._transformData(a) });
    }
    this._setTimer(), (this.source === "collections" || this.source === "product" || this.source === "product-form" || this.source === "custom" || this.source === "customV2") && typeof this.default_available == "string" && (this.showButton = this.default_available === "true"), this.requestUpdate();
  }
  async onUrlChange() {
    var s, r;
    const { searchParams: n } = new URL(window.location.href), e = (s = n.get("variant")) != null ? s : this.variant_id_event;
    await sn((r = this.default_variant) != null ? r : "") ? (this.showButton = !0, this.variant_id_event = e, this._setTimer(), this.requestUpdate()) : (this.variant_id_event = null, this.showButton = !1, this._setTimer(), this.requestUpdate());
  }
  async onVariantChange(n) {
    await nn(this.product_handle, n) ? (this.showButton = !0, this.variant_id_event = n, this._setTimer(), this.requestUpdate()) : (this.variant_id_event = null, this.showButton = !1, this._setTimer(), this.requestUpdate());
  }
  getDevice() {
    return /Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop";
  }
  getBrowser() {
    const { userAgent: n } = navigator;
    let e;
    return n.match(/chrome|chromium|crios/i) ? e = "Chrome" : n.match(/firefox|fxios/i) ? e = "Firefox" : n.match(/safari/i) ? e = "Safari" : n.match(/opr\//i) ? e = "Opera" : n.match(/edg/i) ? e = "Edge" : n.match(/android/i) ? e = "Android" : n.match(/iphone/i) ? e = "iPhone" : e = "Unknown", e;
  }
  getPage() {
    return this.source === "product-form" || this.source === "custom" || this.source === "customV2" || this.source === "product" ? "product" : this.source === "cart" ? window.location.href.includes("cart") ? "cart-page" : "cart-drawer" : "Unknown";
  }
  getButtonColor() {
    return this.theme;
  }
  getButtonShape() {
    var e, t, s, r, i;
    const n = parseInt(
      (i = (r = (s = getComputedStyle(
        (t = (e = document == null ? void 0 : document.querySelector("just-pay-button")) == null ? void 0 : e.shadowRoot) == null ? void 0 : t.querySelector(".just-btn")
      ).borderRadius) == null ? void 0 : s.split) == null ? void 0 : r.call(s, "px")) == null ? void 0 : i[0]
    );
    return n < 5 ? "square" : n < 18 ? "curved" : n >= 18 ? "rounded" : "unknown";
  }
  getAnalyticsData() {
    try {
      return {
        _just_page: this.getPage(),
        _just_browser: this.getBrowser(),
        _just_device: this.getDevice(),
        _just_shape: this.getButtonShape(),
        _just_color: this.getButtonColor()
      };
    } catch {
      return {};
    }
  }
  async _handleClick() {
    var e, t, s, r, i, a;
    this.current_clicked = this._getVariantId();
    const n = this._getCurrentSession();
    if ((n == null ? void 0 : n.command_status) === "CREATED" && !this.features.disable_button_status) {
      this._setState({
        command_status: "CREATED",
        checkoutSessionId: (e = n == null ? void 0 : n.checkoutSessionId) != null ? e : "",
        sessionKey: n.sessionKey
      }), this._createIframe();
      return;
    } else
      this._setState({
        command_status: "PENDING",
        request_status: "LOADING",
        data: this.source === "cart" ? this.state.data : null
      });
    try {
      const o = (s = await ((t = window.JUST_FETCH_DISCOUNT) == null ? void 0 : t.call(window))) != null ? s : "", u = await this._getFetchFn()(), l = this._transformData(u);
      this.custom_data = l, this._setState({
        customAttributes: this.custom_shipping_rates ? [
          ...(i = (r = this._toKeyValue) == null ? void 0 : r.call(this, u.attributes)) != null ? i : [],
          {
            key: "_justCustomShippingRate",
            value: "true"
          }
        ] : (a = this._toKeyValue) == null ? void 0 : a.call(this, { ...u.attributes, ...this.getAnalyticsData() }),
        data: l,
        discountCode: o,
        note: u.note,
        request_status: "SUCCESS"
      }), this._createIframe();
    } catch (o) {
      console.log(o), this._setState({
        command_status: "ERROR",
        request_status: "ERROR",
        data: null
      });
    }
  }
  _removeIframe() {
    const n = document.getElementById("just-frame-payment");
    !n || n == null || n.remove();
  }
  _derivedAnalytics(n) {
    typeof window.fbq == "function" && n.fbq && window.fbq("track", "Purchase", n.fbq);
  }
  _createIframe() {
    if (!!document.getElementById("just-frame-payment"))
      return;
    const e = this.language === "fr" || this.language === "en" ? this.language : "en", t = document.createElement("iframe");
    t.src = `${Rt}/${e}`, t.className = "just-frame", t.id = "just-frame-payment", t.name = "just-frame-payment", t.onload = () => {
      var s;
      this.iframe = t, (s = this.iframe.contentWindow) == null || s.focus();
    }, t.onerror = (s) => {
      console.log("an error occured", s), this.state = {
        ...this.state,
        command_status: "ERROR",
        data: null
      };
    }, document.body.appendChild(t);
  }
  _postMessage(n) {
    var s, r;
    const e = document.getElementById("just-frame-payment"), t = this._getCurrentSession();
    if (e && e.contentWindow) {
      const i = this.features.disable_button_status ? Pt() : (s = n == null ? void 0 : n.requestId) != null ? s : Pt();
      e.contentWindow.postMessage(
        JSON.stringify({
          ...n,
          command_status: this.features.disable_button_status ? "PENDING" : n == null ? void 0 : n.command_status,
          checkoutSessionId: this.features.disable_button_status || n == null ? void 0 : n.checkoutSessionId,
          expiration: this.features.disable_button_status ? 0 : (r = t == null ? void 0 : t.expiration) != null ? r : 0,
          requestId: i,
          language: this.language,
          emitter: "JUST_BUTTON",
          source: this.source,
          app_id: this.app_id,
          domain: this.domain,
          theme: this.theme
        }),
        "*"
      );
    }
  }
  _getLabel(n) {
    var t, s, r;
    const e = this.language;
    if (window.JUST_LABELS) {
      const { fr: i, en: a } = this.translations, { fr: o, en: c } = window.JUST_LABELS, u = {
        fr: {
          ...i,
          ...o != null ? o : {}
        },
        en: {
          ...a,
          ...c != null ? c : {}
        }
      };
      return (t = u == null ? void 0 : u[e]) == null ? void 0 : t[n];
    }
    return (r = (s = this.translations) == null ? void 0 : s[e]) == null ? void 0 : r[n];
  }
  render() {
    var u, l;
    if (!this.app_id || !this.domain || !this.source || this.features.disable_button || !this.showButton)
      return S;
    const n = this.state.command_status === "PENDING" || this.state.request_status === "LOADING", e = {
      white: "just-btn",
      purple: "just-btn",
      default: "just-btn",
      yellow: "just-btn just-btn-yellow"
    }, t = this._getCurrentSession(), s = this.classes[(u = t == null ? void 0 : t.command_status) != null ? u : this.state.command_status], r = `${e[this.theme]} ${s}`, i = this.state.command_status, a = (l = t == null ? void 0 : t.command_status) != null ? l : i, o = this._getLabel(a), c = this.theme === "yellow" ? Jn : Fn;
    return Ct`<div
      role="button"
      part="just-button"
      class=${r}
      ?disabled="${n}"
      @click="${this._handleClick}"
    >
      <div part="just-button-label" class="just-button-label-container">
        <div part="just-button-label-logo" class="just-button-label-logo-container">
          <span part="just-button-main-label" class="just-button-main-label">${o}</span>
          <img part="just-button-logo-img" class="just-button-logo" alt="stars" src=${c} />
        </div>
        ${this.features.payment_indication ? Ct`<span part="just-button-payment-indication" class="just-payment-indication">
              ${this._getLabel("PAYMENT_INDICATION")}
            </span>` : S}
      </div>
    </div>`;
  }
};
N.styles = Kn;
b([
  w()
], N.prototype, "app_id", 2);
b([
  w()
], N.prototype, "domain", 2);
b([
  w()
], N.prototype, "language", 2);
b([
  w()
], N.prototype, "fetchPromoCode", 2);
b([
  w()
], N.prototype, "source", 2);
b([
  w()
], N.prototype, "theme", 2);
b([
  w()
], N.prototype, "iframe", 2);
b([
  w()
], N.prototype, "connection_status", 2);
b([
  w()
], N.prototype, "quantity_selector", 2);
b([
  w()
], N.prototype, "variant_id_event", 2);
b([
  w()
], N.prototype, "default_variant", 2);
b([
  w()
], N.prototype, "custom_shipping_rates", 2);
b([
  w()
], N.prototype, "automatic_redirect", 2);
b([
  w()
], N.prototype, "default_available", 2);
b([
  w()
], N.prototype, "product_id", 2);
b([
  w()
], N.prototype, "product_handle", 2);
b([
  w()
], N.prototype, "classes", 2);
b([
  w({
    type: Object
  })
], N.prototype, "state", 2);
b([
  w()
], N.prototype, "showButton", 2);
b([
  w()
], N.prototype, "handle", 2);
b([
  w()
], N.prototype, "current_clicked", 2);
b([
  w()
], N.prototype, "timer", 2);
b([
  w()
], N.prototype, "timer_iterval", 2);
b([
  w()
], N.prototype, "url", 2);
b([
  w()
], N.prototype, "custom_data", 2);
b([
  w()
], N.prototype, "translations", 2);
b([
  w()
], N.prototype, "features", 2);
N = b([
  Yn("just-pay-button")
], N);
export {
  N as JustPayButton
};