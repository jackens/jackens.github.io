// src/nnn/is.ts
var is = (type, arg) => arg?.constructor === type;

// src/nnn/c.ts
var _c = (node, prefix, result, split) => {
  const queue = [[node, prefix]];
  while (queue.length > 0) {
    const [style0, prefix0] = queue.shift() ?? [];
    if (style0 == null || prefix0 == null) {
      continue;
    }
    if (is(Array, style0)) {
      result.push(prefix0, prefix0 !== "" ? "{" : "", style0.join(";"), prefix0 !== "" ? "}" : "");
    } else {
      const todo = [];
      let attributes = [];
      let attributesPushed = false;
      for (const key in style0) {
        const value = style0[key];
        if (is(String, value) || is(Number, value)) {
          if (!attributesPushed) {
            attributesPushed = true;
            attributes = [];
            todo.push([attributes, prefix0]);
          }
          attributes.push(`${split(key).replace(/([A-Z])/g, (_, letter) => "-" + letter.toLowerCase())}:${value}`);
        } else if (value != null) {
          attributesPushed = false;
          const prefixN = [];
          const keyChunks = key.split(",");
          prefix0.split(",").forEach((prefixChunk) => keyChunks.forEach((keyChunk) => prefixN.push(prefixChunk + keyChunk)));
          todo.push([value, prefixN.join(",")]);
        }
      }
      queue.unshift(...todo);
    }
  }
};
var c = (root, splitter = "$$") => {
  const split = (text) => text.split(splitter)[0];
  const chunks = [];
  for (const key in root) {
    const value = root[key];
    if (value != null) {
      if (key[0] === "@") {
        chunks.push(split(key) + "{");
        _c(value, "", chunks, split);
        chunks.push("}");
      } else {
        _c(value, split(key), chunks, split);
      }
    }
  }
  return chunks.join("");
};

// src/nnn/csvParse.ts
var csvParse = (text, { header = true, separator = "," } = {}) => {
  const regExp = new RegExp(`${separator}|(?<!")\\s*"((?:[^"]|"")*)"\\s*(?!")`, "g");
  const rows = text.replace(/\r/g, "").replace(/\n+$/, "").replace(/\n|(?<!")("(?:[^"]|"")*")(?!")/g, (_, chunk) => chunk ?? "\r").split("\r").map((line) => line.replace(regExp, (_, chunk) => chunk == null ? "\r" : chunk.replace(/""/g, '"')).split("\r"));
  if (header) {
    const keys = rows.shift();
    return rows.map((row) => keys.reduce((record, key, index) => {
      record[key] = row[index];
      return record;
    }, {}));
  }
  return rows;
};

// src/nnn/escape.ts
var escapeValues = (escapeMap, values) => values.map((value) => (escapeMap.get(value?.constructor) ?? escapeMap.get(undefined))?.(value) ?? "");
var escape = (escapeMap, template, ...values) => String.raw(template, ...escapeValues(escapeMap, values));

// src/nnn/h.ts
var NS = {
  xlink: "http://www.w3.org/1999/xlink"
};
var _h = (namespaceURI) => {
  const createElement = namespaceURI == null ? (tag) => document.createElement(tag) : (tag) => document.createElementNS(namespaceURI, tag);
  const h = (tagOrNode, ...args) => {
    const node = is(String, tagOrNode) ? createElement(tagOrNode) : tagOrNode;
    args.forEach((arg) => {
      let child = null;
      if (arg instanceof Node) {
        child = arg;
      } else if (is(String, arg) || is(Number, arg)) {
        child = document.createTextNode(arg);
      } else if (is(Array, arg)) {
        child = h(...arg);
      } else if (arg != null) {
        for (const name in arg) {
          const value = arg[name];
          if (name[0] === "$") {
            const name1 = name.slice(1);
            if (is(Object, value)) {
              node[name1] = node[name1] ?? {};
              Object.assign(node[name1], value);
            } else {
              node[name1] = value;
            }
          } else if (node instanceof Element) {
            const indexOfColon = name.indexOf(":");
            if (indexOfColon >= 0) {
              const ns = NS[name.slice(0, indexOfColon)];
              if (ns != null) {
                const basename = name.slice(indexOfColon + 1);
                if (value === true) {
                  node.setAttributeNS(ns, basename, "");
                } else if (value === false) {
                  node.removeAttributeNS(ns, basename);
                } else {
                  node.setAttributeNS(ns, basename, is(String, value) ? value : "" + value);
                }
              }
            } else {
              if (value === true) {
                node.setAttribute(name, "");
              } else if (value === false) {
                node.removeAttribute(name);
              } else {
                node.setAttribute(name, is(String, value) ? value : "" + value);
              }
            }
          }
        }
      }
      if (child != null) {
        node.appendChild(child);
      }
    });
    return node;
  };
  return h;
};
var h = _h();
var s = _h("http://www.w3.org/2000/svg");
var svgUse = (id, ...args) => s("svg", ["use", { "xlink:href": "#" + id }], ...args);

// src/nnn/fixTypography.ts
var TAGS_TO_SKIP = ["IFRAME", "NOSCRIPT", "PRE", "SCRIPT", "STYLE", "TEXTAREA"];
var fixTypography = (node) => {
  const queue = [node];
  while (queue.length > 0) {
    const node0 = queue.shift();
    if (node0 instanceof Element) {
      node0.childNodes.forEach((childNode) => {
        if (childNode instanceof Text) {
          queue.push(childNode);
        } else if (childNode instanceof Element && !TAGS_TO_SKIP.includes(childNode.tagName)) {
          queue.push(childNode);
        }
      });
    } else if (node0 instanceof Text) {
      const nodeValue = node0.nodeValue?.trim?.();
      if (nodeValue != null) {
        let previousNode = node0;
        nodeValue.split(/(\s|\(|„)([aiouwz—]\s)/gi).forEach((chunk, i) => {
          i %= 3;
          const currentNode = i === 2 ? h("span", { style: "white-space:nowrap" }, chunk) : i === 1 ? document.createTextNode(chunk) : document.createTextNode(chunk.replace(/(\/(?=[^/\s])|\.(?=[^\s]))/g, "$1\u200B"));
          if (node0.parentNode != null) {
            node0.parentNode.insertBefore(currentNode, previousNode.nextSibling);
          }
          previousNode = currentNode;
        });
        node0.parentNode?.removeChild(node0);
      }
    }
  }
};

// src/nnn/has.ts
var has = (key, ref) => (is(String, key) || is(Number, key) || is(Symbol, key)) && Object.hasOwnProperty.call(ref ?? Object, key);

// src/nnn/jsOnParse.ts
var jsOnParse = (handlers, text) => JSON.parse(text, (key, value) => {
  if (is(Object, value)) {
    let isSecondKey = false;
    for (key in value) {
      if (isSecondKey) {
        return value;
      }
      isSecondKey = true;
    }
    const handler = handlers[key];
    const params = value[key];
    if (is(Function, handler) && is(Array, params)) {
      return handler(...params);
    }
  }
  return value;
});

// src/nnn/locale.ts
var locale = (map, defaultVersion) => (text, version = defaultVersion) => {
  const textV = map?.[version]?.[text];
  const textD = map?.[defaultVersion]?.[text];
  return is(String, textV) ? textV : is(String, textD) ? textD : text;
};

// src/nnn/nanolight.ts
var nanolight = (pattern, highlighters, code) => {
  const result = [];
  code.split(pattern).forEach((chunk, index) => {
    if (chunk != null && chunk !== "") {
      index %= highlighters.length;
      result.push(highlighters[index](chunk, index));
    }
  });
  return result;
};

// src/nnn/nanolightJs.ts
var nanolightJs = nanolight.bind(0, /('.*?'|".*?"|`[\s\S]*?`)|(\/\/.*?\n|\/\*[\s\S]*?\*\/)|(any|bigint|break|boolean|case|catch|class|const|continue|debugger|default|delete|do|else|eval|export|extends|false|finally|for|from|function|goto|if|import|in|instanceof|is|keyof|let|NaN|new|number|null|package|return|string|super|switch|symbol|this|throw|true|try|type|typeof|undefined|unknown|var|void|while|with|yield)(?!\w)|([<>=.?:&|!^~*/%+-])|(0x[\dabcdef]+|0o[01234567]+|0b[01]+|\d+(?:\.[\d_]+)?(?:e[+-]?[\d_]+)?)|([$\w]+)(?=\()|([$\wąćęłńóśżźĄĆĘŁŃÓŚŻŹ]+)/, [
  (chunk) => chunk,
  (chunk) => ["span", { class: "string" }, chunk],
  (chunk) => ["span", { class: "comment" }, chunk],
  (chunk) => ["span", { class: "keyword" }, chunk],
  (chunk) => ["span", { class: "operator" }, chunk],
  (chunk) => ["span", { class: "number" }, chunk],
  (chunk) => ["span", { class: "function" }, chunk],
  (chunk) => ["span", { class: "literal" }, chunk]
]);

// src/nnn/pick.ts
var pick = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
var omit = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)));

// src/nnn/plUral.ts
var plUral = (singular, plural2, plural5, value) => {
  const absValue = Math.abs(value);
  const absValueMod10 = absValue % 10;
  return value === 1 ? singular : (absValueMod10 === 2 || absValueMod10 === 3 || absValueMod10 === 4) && absValue !== 12 && absValue !== 13 && absValue !== 14 ? plural2 : plural5;
};

// src/nnn/pro.ts
var pro = (ref) => new Proxy(ref, {
  get(target, key) {
    return pro(target[key] = target[key] ?? {});
  }
});

// src/nnn/refsInfo.ts
var refsInfo = (...refs) => {
  const fns = new Set;
  refs.forEach((ref) => {
    while (is(Function, ref) && !fns.has(ref) && `${ref}`.includes("[native code]")) {
      fns.add(ref);
      ref = Object.getPrototypeOf(ref);
    }
  });
  return Array.from(fns.values()).map((fn) => [
    fn.name,
    Object.getPrototypeOf(fn)?.name ?? "",
    Object.getOwnPropertyNames(fn.prototype ?? Object.create(null)).sort()
  ]).sort((a, b) => -(a[0] < b[0]));
};

// src/nnn/uuid1.ts
var ZEROS = "0".repeat(16);
var counter = 0;
var uuid1 = ({
  date = new Date,
  node = Math.random().toString(16).slice(2)
} = {}) => {
  const time = ZEROS + (1e4 * (+date + 12219292800000)).toString(16);
  counter = counter + 1 & 16383;
  return time.slice(-8).concat("-", time.slice(-12, -8), -1, time.slice(-15, -12), "-", (8 | counter >> 12).toString(16), (ZEROS + (counter & 4095).toString(16)).slice(-3), "-", (ZEROS + node).slice(-12));
};
export {
  uuid1,
  svgUse,
  s,
  refsInfo,
  pro,
  plUral,
  pick,
  omit,
  nanolightJs,
  nanolight,
  locale,
  jsOnParse,
  is,
  has,
  h,
  fixTypography,
  escapeValues,
  escape,
  csvParse,
  c
};
