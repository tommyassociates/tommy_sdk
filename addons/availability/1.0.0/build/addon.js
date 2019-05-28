var addon=[{path:"/availability/",component:{render:function(){var i=this,a=i.$createElement,r=i._self._c||a;return r("f7-page",{attrs:{id:"availability__index"},on:{"page:afterin":i.onPageAfterIn,"page:beforeout":i.onPageBeforeOut}},[r("f7-navbar",[r("tommy-nav-menu"),i._v(" "),r("f7-nav-title",[i._v(i._s(i.$t("availability.index.title","Availabilities")))]),i._v(" "),i.formChanged?r("f7-nav-right",[r("f7-link",{attrs:{"icon-f7":"check"},on:{click:i.save}})],1):i._e()],1),i._v(" "),i.showRefreshPanel?r("div",{staticClass:"refresh-panel"},[i._v(" "+i._s(i.$t("availability.index.last_updated","Last updated"))+": "),r("span",{staticClass:"time"},[i._v(i._s(i.refreshPanelText))]),i._v(" "),r("a",{staticClass:"refresh",attrs:{href:"#"},on:{click:i.loadAvailabilities}},[i._v(i._s(i.$t("availability.index.refresh","Refresh")))])]):i._e(),i._v(" "),i.isNurse?i._e():r("f7-list",{staticClass:"no-margin-top",attrs:{"no-hairlines":""}},[r("f7-list-item",{attrs:{title:i.$t("availability.index.available_button")}},[r("f7-toggle",{attrs:{slot:"after",checked:i.availableForWork},on:{change:function(a){i.changeAvailableForWork(a.target.checked)}},slot:"after"})],1)],1),i._v(" "),i.items?r("f7-list",{staticClass:"no-margin",attrs:{"no-hairlines":""}},i._l(i.items,function(t,e){return r("f7-list-item",{key:e},[r("div",{staticClass:"availability__list-date"},[r("strong",[i._v(i._s(i.dayOrToday(t.start_at)))]),i._v(" "),r("span",[i._v(i._s(i.formatDate(t.start_at,"Do MMM")))])]),i._v(" "),r("div",{staticClass:"availability__toggle-container"},[r("a",{staticClass:"availability__toggle-availability",class:i.availabilityClass("am",t.data),attrs:{href:"#"},on:{click:function(a){i.toggle(t,e,"am")}}},[r("span",{domProps:{innerHTML:i._s(i.$t("availability.word.am","am"))}})]),i._v(" "),r("a",{staticClass:"availability__toggle-availability",class:i.availabilityClass("pm",t.data),attrs:{href:"#"},on:{click:function(a){i.toggle(t,e,"pm")}}},[r("span",{domProps:{innerHTML:i._s(i.$t("availability.word.pm","pm"))}})]),i._v(" "),r("a",{staticClass:"availability__toggle-availability",class:i.availabilityClass("nd",t.data),attrs:{href:"#"},on:{click:function(a){i.toggle(t,e,"nd")}}},[r("span",{domProps:{innerHTML:i._s(i.$t("availability.word.nd","nd"))}})])])])})):i._e()],1)},staticRenderFns:[],data:function data(){for(var e=this,a={},t=e.$moment().subtract(1,"day").startOf("day"),i=e.$moment().add(2,"weeks").endOf("week"),r=t.clone(),o=e.$root.account&&(0<=e.$root.account.roles.indexOf("Nurse")||0<=e.$root.account.roles.indexOf("Employee"));r.add(1,"day")<i;){var n=r.format("YYYY-MM-DD");a[n]||(a[n]={start_at:r.format(),data:{}})}var s=e.$f7route.query.actor_id,l=!1;return e.$root.teamMembers&&e.$root.teamMembers.forEach(function(a){var t=s||e.$root.user.id;a.user_id===parseInt(t,10)&&(l=0<=a.tags.indexOf("Available For Work"))}),{startAt:t,endAt:i,items:a,formChanged:!1,lastUpdated:null,showRefreshPanel:!1,refreshPanelTimeout:null,refreshPanelInterval:null,refreshPanelText:"1 min ago",actor_id:s,availableForWork:l,isNurse:o}},methods:{changeAvailableForWork:function changeAvailableForWork(a){var t=this;t.availableForWork=!0;var e=t.actor_id||t.$root.user.id,i=t.$root.teamMembers.filter(function(a){return a.user_id===parseInt(e,10)})[0];if(i){var r=[].concat(i.tags);a?r.push("Available For Work"):r.splice(r.indexOf("Available For Work"),1),t.$api.updateCurrentTeamMember(e,{tags:r.length?r:[""]})}},onPageAfterIn:function onPageAfterIn(){var a=this;a.loadAvailabilities(),a.refreshPanelInterval=setInterval(function(){a.refreshPanelText=a.$moment(a.lastUpdated).fromNow()},2e4)},onPageBeforeOut:function onPageBeforeOut(){clearTimeout(this.refreshPanelTimeout),clearInterval(this.refreshPanelInterval)},toggle:function toggle(a,t,e){var i=this;if("true"!==a.data[e+"_locked"]&&!0!==a.data[e+"_locked"]){var r=a.data[e];r&&"0"!==r||(a.data[e]=1),1!==r&&"1"!==r||(a.data[e]=-1),-1!==r&&"-1"!==r||(a.data[e]=0),a.changed=!0,i.items[t]=a,i.formChanged=!0,i.$forceUpdate()}},dayOrToday:function dayOrToday(a){var t=this.$moment(a);return t.isSame(this.$moment(),"day")?"Today":t.format("dddd")},formatDate:function formatDate(a,t){var e=this.$moment.utc(a).toDate();return this.$moment(e).format(t)},availabilityClass:function availabilityClass(a,t){return t&&"true"===t[a+"_locked"]||!0===t[a+"_locked"]?"locked":!t||-1!==t[a]&&"-1"!==t[a]?!t||1!==t[a]&&"1"!==t[a]?"":"available":"unavailable"},loadAvailabilities:function loadAvailabilities(){var e=this,a={addon:"availability",kind:"Availability",user_id:e.actor_id||e.$root.user.id,date_range:[e.startAt.utc().format(),e.endAt.utc().format()]};return e.actor_id&&(a.actor_id=e.actor_id),e.showRefreshPanel=!1,e.$api.getFragments(a,{cache:!1}).then(function(a){e.lastUpdated=new Date,e.refreshPanelTimeout=setTimeout(function(){e.showRefreshPanel=!0},41e3),a.forEach(function(a){var t=e.$moment(a.start_at).format("YYYY-MM-DD");a.data||(a.data={}),e.items[t]&&e.items[t].data&&Object.assign(a.data,e.items[t].data),e.items[t]=a,e.$forceUpdate()})})},save:function save(){var r=this;r.formChanged=!1,Object.keys(r.items).forEach(function(t){var a=r.items[t];if(a.changed){a.changed=!1;var e={am:a.data.am||0,pm:a.data.pm||0,nd:a.data.nd||0};!0!==a.data.am_locked&&"true"!==a.data.am_locked||(e.am_locked=!0),!0!==a.data.pm_locked&&"true"!==a.data.pm_locked||(e.pm_locked=!0),!0!==a.data.nd_locked&&"true"!==a.data.nd_locked||(e.nd_locked=!0);var i=Object.assign({},a,{addon:"availability",kind:"Availability",data:JSON.stringify(e),start_at:t,user_id:r.actor_id||r.$root.user.id});r.actor_id&&(i.actor_id=r.actor_id),a.id?r.$api.updateFragment(a.id,Object.assign(i)).then(function(a){r.items[t]=a,r.$forceUpdate()}):r.$api.createFragment(i).then(function(a){r.items[t]=a,r.$forceUpdate()})}})}}}}];