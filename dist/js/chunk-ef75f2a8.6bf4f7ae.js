(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ef75f2a8"],{"4bd4":function(t,a,e){"use strict";e("4de4"),e("7db0"),e("4160"),e("caad"),e("07ac"),e("2532"),e("159b");var n=e("5530"),r=e("58df"),i=e("7e2b"),s=e("3206");a["a"]=Object(r["a"])(i["a"],Object(s["b"])("form")).extend({name:"v-form",inheritAttrs:!1,props:{lazyValidation:Boolean,value:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(t){var a=Object.values(t).includes(!0);this.$emit("input",!a)},deep:!0,immediate:!0}},methods:{watchInput:function(t){var a=this,e=function(t){return t.$watch("hasError",(function(e){a.$set(a.errorBag,t._uid,e)}),{immediate:!0})},n={_uid:t._uid,valid:function(){},shouldValidate:function(){}};return this.lazyValidation?n.shouldValidate=t.$watch("shouldValidate",(function(r){r&&(a.errorBag.hasOwnProperty(t._uid)||(n.valid=e(t)))})):n.valid=e(t),n},validate:function(){return 0===this.inputs.filter((function(t){return!t.validate(!0)})).length},reset:function(){this.inputs.forEach((function(t){return t.reset()})),this.resetErrorBag()},resetErrorBag:function(){var t=this;this.lazyValidation&&setTimeout((function(){t.errorBag={}}),0)},resetValidation:function(){this.inputs.forEach((function(t){return t.resetValidation()})),this.resetErrorBag()},register:function(t){this.inputs.push(t),this.watchers.push(this.watchInput(t))},unregister:function(t){var a=this.inputs.find((function(a){return a._uid===t._uid}));if(a){var e=this.watchers.find((function(t){return t._uid===a._uid}));e&&(e.valid(),e.shouldValidate()),this.watchers=this.watchers.filter((function(t){return t._uid!==a._uid})),this.inputs=this.inputs.filter((function(t){return t._uid!==a._uid})),this.$delete(this.errorBag,a._uid)}}},render:function(t){var a=this;return t("form",{staticClass:"v-form",attrs:Object(n["a"])({novalidate:!0},this.attrs$),on:{submit:function(t){return a.$emit("submit",t)}}},this.$slots.default)}})},a55b:function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("v-card",{staticClass:"mx-auto elevation-12",staticStyle:{top:"20vh"},attrs:{"max-width":"500"}},[e("v-toolbar",{staticClass:"primary darken-4",attrs:{dark:"",flat:""}},[e("v-toolbar-title",[t._v("Login form")]),e("v-spacer")],1),e("v-card-text",[e("v-form",[e("v-text-field",{attrs:{color:"primary",label:"Username",name:"username",type:"text"},model:{value:t.username,callback:function(a){t.username=a},expression:"username"}}),e("v-text-field",{attrs:{color:"primary",id:"password",label:"Password",name:"password",type:"password"},model:{value:t.password,callback:function(a){t.password=a},expression:"password"}})],1)],1),e("v-card-actions",[e("v-spacer"),e("v-btn",{staticClass:"primary lighten-2",attrs:{loading:t.signInLoaderFlag},on:{click:t.signInClicked}},[t._v("Login")])],1)],1)},r=[],i=(e("d3b7"),e("bc3a")),s=e.n(i),o={name:"Login",data:function(){return{username:null,password:null,signInLoaderFlag:!1}},methods:{signInClicked:function(){var t=this,a={username:this.username,password:this.password};console.log("Data: ",a),this.signInLoaderFlag=!0,s.a.post("/api/login",a).then((function(a){a.data.token&&console.log("token received"),t.$store.commit("setToken",a.data.token),t.$router.push({name:"Search"}),localStorage.setItem("x-auth",a.data.token),t.$store.commit("login")})).catch((function(t){console.log("error"),console.log(t.response)})).finally((function(){console.log("finished"),t.signInLoaderFlag=!1}))}}},u=o,l=e("2877"),d=e("6544"),c=e.n(d),h=e("8336"),f=e("b0af"),p=e("99d9"),m=e("4bd4"),v=e("2fa4"),g=e("8654"),b=e("71d9"),w=e("2a7f"),V=Object(l["a"])(u,n,r,!1,null,"00348dfd",null);a["default"]=V.exports;c()(V,{VBtn:h["a"],VCard:f["a"],VCardActions:p["a"],VCardText:p["b"],VForm:m["a"],VSpacer:v["a"],VTextField:g["a"],VToolbar:b["a"],VToolbarTitle:w["a"]})}}]);
//# sourceMappingURL=chunk-ef75f2a8.6bf4f7ae.js.map