  function formatArgs(args) {
      var str = [];
      for (var i = 0; i < args.length; i++) {
          var item = args[i];

          if (item && item.constructor == Array) {
              str.push("Array(" + item.length + ")");
          } else if (item && item.jquery) {
              str.push("jQuery(" + item.length + ")");
          } else if (item && item.nodeName) {
              str.push(formatElem(item));
          } else if (item && typeof item == "function") {
              str.push("function()");
          } else if (item && typeof item == "object") {
              str.push("{...}");
          } else if (typeof item == "string") {
              str.push('"' + item.replace(/&/g, "&amp;").replace(/</g, "&lt;") + '"');
          } else {
              str.push(item + "");
          }
      }
      return str.join(", ");
  }