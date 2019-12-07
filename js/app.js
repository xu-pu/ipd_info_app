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

data.catalog = _.map(_.range(100),function(i){
    return {
        id: i,
        title: faker.lorem.sentence(),
        abstract: faker.lorem.paragraph(),
        tags: _.sample(data.tags,(_.random(2,6)))
    }
});

data.recommandations = _.sample(data.catalog,10);

data.profile.tags = _.sample(data.tags,10);

Vue.component('info-list',{
    props: ['items'],
    template: `
  <ol id="catalog-container">
    <li v-for="item in items">
      <div class="item-title">{{item.title}}</div>
      <hr/>
      <div class="item-tags">
        Tags:
        <div v-for="tag in item.tags" class="item-tag">{{tag.name}}</div>
      </div>
      <hr/>
      <div class="item-abstract">{{item.abstract}}</div>
    </li>
  </ol>
    `
});

const Catalog = {
    data: function(){ return data; },
    template: `<div>
                 <info-list v-bind:items="catalog"></info-list>
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
    template: `<div>
                  <div class="rec-desc">這是通過您的個人信息，為您篩選出的，與您最匹配的信息</div>
                  <info-list v-bind:items="recommandations"></info-list>
               </div>`
};

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
    { path: '/catalog', component: Catalog },
    { path: '/profile', component: Profile },
    { path: '/recommandation', component: Recommandation },
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