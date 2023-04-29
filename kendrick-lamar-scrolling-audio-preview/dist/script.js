var script = {
  data() {
    return {
      tracks: [
        {
          name: "...",
          image: "233732472_977435916443344_1608956883834127512_n.jpg",
          audio: "nickelback-heromp3gidme_ICSb0q71.mp3"
        }, {
          name: "...",
          image: "278254407_679235256735104_8101924434556439260_n.jpg",
          audio: "https://p.scdn.co/mp3-preview/6a11053cd32e91cbec5d500453e601d7886f3565?cid=774b29d4f13844c495f206cafdad9c86"
        }, {
          name: "...",
          image: "254162086_615917449448759_760576740568897206_n.jpg",
          audio: "doja-cat-ft-the-weeknd-you-right_frYxRdAR.mp3"
        }, {
          name: "...",
          image: "309920784_772445307196431_7262831878405016282_n.jpg",
          audio: "kaash-paige-love-songs-musmorecom_yRXqUSqc.mp3"
        },
        {
          name: "...",
          image: "photo_2023-04-29_15-06-54.jpg",
          audio: "dvrst-dream-space-musmorecom_KIeyp9OY.mp3"
        },
        {
          name: "...",
          image: "311178502_168274409127989_7329412178852243130_n.jpg",
          audio: "billie-eilish-khalid-lovely_t91V7BoX.mp3"
        }
      ],
      currentTrack: 0,
      playing: false,
      volume: 1
    }
  },
  computed: {
    track() {
      return this.tracks[this.currentTrack]  
    }
  },
  watch: {
    currentTrack(newVal, oldVal) {
      this.tracks[oldVal].sound.pause();
      this.tracks[newVal].sound.play();
      
      this.$refs.tracks.children[oldVal].style.opacity = 0.25;
      this.$refs.tracks.children[oldVal].style.filter = 'grayscale(1.0)';
    },
    volume(newVal, oldVal) {
      this.track.sound.volume(newVal);
    }
  },
  methods: {
    loadSounds() {
      this.tracks.forEach((track, i) => {
        track.sound = new Howl({
          src: [track.audio],
          format: ['mp3'],
          preload: true,
          autoplay: false,
          loop: true,
          volume: i == 0 ? 1.0 : 0.0,
          onplay: () => {
            this.playing = true;
          },
          onpause: () => {
            this.playing = false;
          }
        });
      });
    },
    toggle() {
      if (this.track.sound.playing()) {
        this.track.sound.pause();
      } else {
        this.track.sound.play();
      }
    },
    scrollLeft(i) {
      let $child = this.$refs.tracks.children[0];
      
      this.$refs.tracks.scrollTo({
        top: 0,
        left: $child.offsetWidth * i,
        behavior: 'smooth'
      });
    },
    onScroll(e) {
      let $child = this.$refs.tracks.children[0];
      let childWidth = $child.offsetWidth;
      let containerX = (window.innerWidth - childWidth) / 2;
      let childX = $child.getBoundingClientRect().x;
      let offset = childX - containerX;
      let percentOffset = Math.abs(offset / childWidth);
      let currentTrack = Math.round(percentOffset);
      let volume = 1.0 - ((Math.abs(currentTrack - percentOffset)) / 0.5);
      
      this.$refs.tracks.children[currentTrack].style.opacity = volume * 0.75 + 0.25;
      this.$refs.tracks.children[currentTrack].style.filter = `grayscale(${1.0 - volume})`;
      
      this.currentTrack = currentTrack;
      this.volume = volume;
    }
  },
  mounted() {
    this.$refs.tracks.onscroll = this.onScroll;
    
    this.loadSounds();
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("section", [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      { ref: "tracks", attrs: { id: "tracks" } },
      _vm._l(_vm.tracks, function(track, i) {
        return _c(
          "div",
          {
            key: "track-" + i,
            staticClass: "track",
            class: { current: _vm.currentTrack == i },
            on: {
              click: function($event) {
                return _vm.scrollLeft(i)
              }
            }
          },
          [_c("img", { attrs: { src: track.image } })]
        )
      }),
      0
    ),
    _vm._v(" "),
    _c("footer", [
      _c("button", { on: { click: _vm.toggle } }, [
        _vm.playing
          ? _c(
              "svg",
              {
                attrs: {
                  xmlns: "http://www.w3.org/2000/svg",
                  height: "24px",
                  viewBox: "0 0 24 24",
                  width: "24px",
                  fill: "#000000"
                }
              },
              [
                _c("path", { attrs: { d: "M0 0h24v24H0V0z", fill: "none" } }),
                _c("path", { attrs: { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" } })
              ]
            )
          : _c(
              "svg",
              {
                attrs: {
                  xmlns: "http://www.w3.org/2000/svg",
                  height: "24px",
                  viewBox: "0 0 24 24",
                  width: "24px",
                  fill: "#000000"
                }
              },
              [
                _c("path", { attrs: { d: "M0 0h24v24H0z", fill: "none" } }),
                _c("path", { attrs: { d: "M8 5v14l11-7z" } })
              ]
            )
      ])
    ])
  ])
};
var __vue_staticRenderFns__ = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("header", [
      _c("img", {
        attrs: { src: "" }
      })
    ])
  }
];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-55c66527_0", { source: "\nhtml, body, section{\n  height: 100%;\n  width: 100%;\n}\nbody{\n  background: black;\n}\nheader{\n  display: flex;\n  justify-content: center;\n  position: absolute;\n  top: 2vh;\n  width: 100%;\n}\nheader img{\n  border: 1px solid white;\n  display: block;\n  height: 4vh;\n}\nfooter{\n  bottom: 2vh;\n  display: flex;\n  justify-content: center;\n  position: absolute;\n  width: 100%;\n}\nfooter button{\n  appearance: none;\n  -webkit-appearance: none;\n  background: none;\n  border: none;\n  cursor: pointer;\n  margin: 0;\n  padding: 0;\n}\nfooter button:focus{\n  outline: none;\n}\nfooter button svg{\n  fill: white;\n  height: 8vh;\n  width: 8vh;\n}\n#tracks{\n  display: flex;\n  height: 100%;\n  overflow-x: scroll;\n  scroll-snap-type: x mandatory;\n  width: 100%;\n}\n#tracks::-webkit-scrollbar{\n  display: none;\n}\n#tracks::after{\n  content: \"\";\n  border-left: 25vw solid transparent;\n}\n#tracks .track{\n  align-items: center;\n  cursor: pointer;\n  display: flex;\n  filter: grayscale(1.0);\n  flex: none;\n  justify-content: center;\n  scroll-snap-align: center;\n  opacity: 0.25;\n  width: 50vw;\n}\n#tracks .track:first-child{\n  margin-left: 25vw;\n}\n#tracks .track img{\n  display: block;\n  width: 75%;\n}\n#tracks .track.current{\n  filter: grayscale(0.0);\n  opacity: 1;\n}\n#tracks .track.current img{\n  filter: none;\n}\n", map: {"version":3,"sources":["/tmp/codepen/vuejs/src/pen.vue"],"names":[],"mappings":";AAkOA;EACA,YAAA;EACA,WAAA;AACA;AAEA;EACA,iBAAA;AACA;AAEA;EACA,aAAA;EACA,uBAAA;EACA,kBAAA;EACA,QAAA;EACA,WAAA;AACA;AAEA;EACA,uBAAA;EACA,cAAA;EACA,WAAA;AACA;AAEA;EACA,WAAA;EACA,aAAA;EACA,uBAAA;EACA,kBAAA;EACA,WAAA;AACA;AAEA;EACA,gBAAA;EACA,wBAAA;EACA,gBAAA;EACA,YAAA;EACA,eAAA;EACA,SAAA;EACA,UAAA;AACA;AAEA;EACA,aAAA;AACA;AAEA;EACA,WAAA;EACA,WAAA;EACA,UAAA;AACA;AAEA;EACA,aAAA;EACA,YAAA;EACA,kBAAA;EACA,6BAAA;EACA,WAAA;AACA;AAEA;EACA,aAAA;AACA;AAEA;EACA,WAAA;EACA,mCAAA;AACA;AAEA;EACA,mBAAA;EACA,eAAA;EACA,aAAA;EACA,sBAAA;EACA,UAAA;EACA,uBAAA;EACA,yBAAA;EACA,aAAA;EACA,WAAA;AACA;AAEA;EACA,iBAAA;AACA;AAEA;EACA,cAAA;EACA,UAAA;AACA;AAEA;EACA,sBAAA;EACA,UAAA;AACA;AAEA;EACA,YAAA;AACA","file":"pen.vue","sourcesContent":["<template>\n  <section>\n    <header>\n      <img src=\"https://assets.codepen.io/141041/parental-advisory.png\" />\n    </header>\n    \n    <div id=\"tracks\" ref=\"tracks\">\n      <div class=\"track\" v-for=\"(track, i) in tracks\" :key=\"`track-${i}`\" :class=\"{ current: currentTrack == i }\" @click=\"scrollLeft(i)\">\n        <img :src=\"track.image\" />\n      </div>\n    </div>\n    \n    <footer>\n      <button @click=\"toggle\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"#000000\" v-if=\"playing\"><path d=\"M0 0h24v24H0V0z\" fill=\"none\"/><path d=\"M6 19h4V5H6v14zm8-14v14h4V5h-4z\"/></svg>\n        <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"#000000\" v-else><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M8 5v14l11-7z\"/></svg>\n      </button>\n    </footer>\n  </section>\n</template>\n\n<script>\nexport default{\n  data() {\n    return {\n      tracks: [\n        {\n          name: \"HUMBLE.\",\n          image: \"https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699\",\n          audio: \"https://p.scdn.co/mp3-preview/dca63100f96e4000e719433d36131a9b5a5883c9?cid=774b29d4f13844c495f206cafdad9c86\"\n        }, {\n          name: \"Money Trees\",\n          image: \"https://i.scdn.co/image/ab67616d0000b273d28d2ebdedb220e479743797\",\n          audio: \"https://p.scdn.co/mp3-preview/6a11053cd32e91cbec5d500453e601d7886f3565?cid=774b29d4f13844c495f206cafdad9c86\"\n        }, {\n          name: \"Alright\",\n          image: \"https://i.scdn.co/image/ab67616d0000b273cdb645498cd3d8a2db4d05e1\",\n          audio: \"https://p.scdn.co/mp3-preview/ac83409be8e38466b68bbcf0f7b117ef591f0865?cid=774b29d4f13844c495f206cafdad9c86\"\n        }, {\n          name: \"untitled 08 | 09.06.2014.\",\n          image: \"https://i.scdn.co/image/ab67616d0000b2738c697f553a46006a5d8886b2\",\n          audio: \"https://p.scdn.co/mp3-preview/3a7d470dec3a52024bc2567e14c082a4189574b7?cid=774b29d4f13844c495f206cafdad9c86\"\n        }\n      ],\n      currentTrack: 0,\n      playing: false,\n      volume: 1\n    }\n  },\n  computed: {\n    track() {\n      return this.tracks[this.currentTrack]  \n    }\n  },\n  watch: {\n    currentTrack(newVal, oldVal) {\n      this.tracks[oldVal].sound.pause()\n      this.tracks[newVal].sound.play()\n      \n      this.$refs.tracks.children[oldVal].style.opacity = 0.25\n      this.$refs.tracks.children[oldVal].style.filter = 'grayscale(1.0)'\n    },\n    volume(newVal, oldVal) {\n      this.track.sound.volume(newVal)\n    }\n  },\n  methods: {\n    loadSounds() {\n      this.tracks.forEach((track, i) => {\n        track.sound = new Howl({\n          src: [track.audio],\n          format: ['mp3'],\n          preload: true,\n          autoplay: false,\n          loop: true,\n          volume: i == 0 ? 1.0 : 0.0,\n          onplay: () => {\n            this.playing = true\n          },\n          onpause: () => {\n            this.playing = false\n          }\n        })\n      })\n    },\n    toggle() {\n      if (this.track.sound.playing()) {\n        this.track.sound.pause()\n      } else {\n        this.track.sound.play()\n      }\n    },\n    scrollLeft(i) {\n      let $child = this.$refs.tracks.children[0]\n      \n      this.$refs.tracks.scrollTo({\n        top: 0,\n        left: $child.offsetWidth * i,\n        behavior: 'smooth'\n      })\n    },\n    onScroll(e) {\n      let $child = this.$refs.tracks.children[0]\n      let childWidth = $child.offsetWidth\n      let containerX = (window.innerWidth - childWidth) / 2\n      let childX = $child.getBoundingClientRect().x\n      let offset = childX - containerX\n      let percentOffset = Math.abs(offset / childWidth)\n      let currentTrack = Math.round(percentOffset)\n      let volume = 1.0 - ((Math.abs(currentTrack - percentOffset)) / 0.5)\n      \n      this.$refs.tracks.children[currentTrack].style.opacity = volume * 0.75 + 0.25\n      this.$refs.tracks.children[currentTrack].style.filter = `grayscale(${1.0 - volume})`\n      \n      this.currentTrack = currentTrack\n      this.volume = volume\n    }\n  },\n  mounted() {\n    this.$refs.tracks.onscroll = this.onScroll\n    \n    this.loadSounds()\n  }\n}\n</script>\n\n<style>\n  html, body, section{\n    height: 100%;\n    width: 100%;\n  }\n  \n  body{\n    background: black;\n  }\n  \n  header{\n    display: flex;\n    justify-content: center;\n    position: absolute;\n    top: 2vh;\n    width: 100%;\n  }\n  \n  header img{\n    border: 1px solid white;\n    display: block;\n    height: 4vh;\n  }\n  \n  footer{\n    bottom: 2vh;\n    display: flex;\n    justify-content: center;\n    position: absolute;\n    width: 100%;\n  }\n  \n  footer button{\n    appearance: none;\n    -webkit-appearance: none;\n    background: none;\n    border: none;\n    cursor: pointer;\n    margin: 0;\n    padding: 0;\n  }\n  \n  footer button:focus{\n    outline: none;\n  }\n  \n  footer button svg{\n    fill: white;\n    height: 8vh;\n    width: 8vh;\n  }\n  \n  #tracks{\n    display: flex;\n    height: 100%;\n    overflow-x: scroll;\n    scroll-snap-type: x mandatory;\n    width: 100%;\n  }\n  \n  #tracks::-webkit-scrollbar{\n    display: none;\n  }\n  \n  #tracks::after{\n    content: \"\";\n    border-left: 25vw solid transparent;\n  }\n  \n  #tracks .track{\n    align-items: center;\n    cursor: pointer;\n    display: flex;\n    filter: grayscale(1.0);\n    flex: none;\n    justify-content: center;\n    scroll-snap-align: center;\n    opacity: 0.25;\n    width: 50vw;\n  }\n  \n  #tracks .track:first-child{\n    margin-left: 25vw;\n  }\n  \n  #tracks .track img{\n    display: block;\n    width: 75%;\n  }\n  \n  #tracks .track.current{\n    filter: grayscale(0.0);\n    opacity: 1;\n  }\n  \n  #tracks .track.current img{\n    filter: none;\n  }\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

export default __vue_component__;