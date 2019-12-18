'use strict';

var data = {
    catalog: [],
    tags: [],
    recommandations: [],
    profile: {
        tags: []
    }
};

data.tags = _.map(_.range(20),function(i){
    return {
        idx: i,
        name: faker.random.word()
    }
});

data.catalog = _.map(hyq_data.Sheet1,function(item,i){
    item.id = i;
    return item;
});

data.recommandations = _.sample(data.catalog,10);

data.profile.tags = _.sample(data.tags,10);

Vue.component('info-list-item',{

    props: ['item'],

    methods: {

        enter(){
            this.$emit('enter',this.item.id);
        }

    },

    template: `
      <div>
          <div class="item-title" v-on:click="enter">{{item.title}}</div>
          <hr/>
          <div class="item-host">主辦方: {{item.host}}</div>
          <hr/>
          <div class="item-abstract">{{item.abstract}}</div>      
      </div>
    `

});

Vue.component('info-list',{

    props: ['items'],

    methods: {

        enterItem(id){
            this.$emit('enterItem',id);
        }

    },

    template: `
  <ol class="info-list">
    <li v-for="item in items">
      <info-list-item v-bind:item="item" v-on:enter="enterItem"></info-list-item>
    </li>
  </ol>
    `

});

const Catalog = {

    data: function(){ return data; },

    methods: {

        enterItem(id){
            this.$router.push({ path: `/catalog/item/${id}` });
        }

    },

    template: `<div>
                 <div id="catalog-container">
                     <info-list v-bind:items="catalog" v-on:enterItem="enterItem"></info-list>
                 </div>
                 <router-view id="catalog-outlet"></router-view>
               </div>`
};

const Profile = {
    data: function(){ return data; },
    template:
`<div>
  <div>
    <div>個人信息</div>
  </div>
  <hr/>
  <div>
    <div>我的標簽</div>
    <div id="profile-tag-container">
      <div v-for="tag in profile.tags" class="profile-tag">{{tag.name}}</div>
    </div>
  </div>
</div>`
};

const Recommandation = {

    data: function(){ return data; },

    methods: {

        enterItem(id){
            this.$router.push({ path: `/recommandation/item/${id}` });
        }

    },

    template: `<div>
                  <div id="recommandation-container">
                      <div class="rec-desc">這是通過您的個人信息，為您篩選出的，與您最匹配的信息</div>
                      <info-list v-bind:items="recommandations" v-on:enterItem="enterItem"></info-list>                  
                  </div>
                  <router-view id="recommandation-outlet"></router-view>
               </div>`

};

const InfoItemPage = {

    data: function(){
        return {
            item: null
        };
    },

    beforeRouteEnter (to, from, next) {
        next(function(comp){
            comp.item = data.catalog[to.params.id];
        });
    },

    beforeRouteUpdate (to, from, next) {
        this.item = data.catalog[to.params.id];
    },

    template: `
      <div v-if="item" class="item-page">
          <div class="item-title">{{item.title}}</div>
          <hr/>
          <div><span>標簽:</span> {{item.labels}}</div>
          <div><span>受眾人群:</span> {{item.target_audience}}</div>
          <hr/>
          <div class="item-abstract">{{item.abstract}}</div>      
          <hr/>
          <div><span>主辦方:</span> {{item.host}}</div>
          <div><span>費用:</span> {{item.fee}}</div>
          <div><span>活動地點:</span> {{item.location}}</div>
          <div><span>活動時間:</span> {{item.date}}, {{item.time}}</div>
          <div><span>聯系方式:</span> {{item.contact}}</div>
          <hr/>
          <div><span>報名方法:</span> {{item.enroll_method}}</div>
          <div><span>報名截止日期:</span> {{item.enroll_deadline}}</div>
          <div><span>報名須知:</span> {{item.enroll_notice}}</div>
          <div><a target="_blank" v-bind:href="item.enroll_link">報名鏈接</a></div>
          <hr/>
          <div><a target="_blank" v-bind:href="item.link">原始鏈接</a></div>

      </div>`

};

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
    { path: '/catalog', component: Catalog, children: [
            { path: 'item/:id', component: InfoItemPage }
    ]},
    { path: '/profile', component: Profile },
    { path: '/recommandation', component: Recommandation, children: [
            { path: 'item/:id', component: InfoItemPage }
    ]},
    { path: '*', redirect: '/catalog' },
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes // short for `routes: routes`
});

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const app = new Vue({
    router
}).$mount('#app');

// Now the app has started!