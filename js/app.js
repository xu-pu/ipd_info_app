'use strict';

var data = {
    catalog: [],
    tags: [],
    recommandations: []
};

data.tags = _.map(_.range(20),function(i){
    return {
        idx: i,
        name: faker.random.word()
    }
});

function random_tags(N){
    return _.map(_.sample(data.tags,N),function(tag){
        return tag.idx;
    });
}

data.catalog = _.map(_.range(100),function(i){
    return {
        id: i,
        title: faker.random.words(_.random(5,10)),
        abstract: faker.random.words(_.random(20,30)),
        tags: random_tags(_.random(2,6)),
    }
});

const Catalog = {
    data: function(){ return data; },
    template: `
<div id="catalog-container">
  <ol>
    <li v-for="item in catalog">
      <span>{{item.title}}</span>
      <span>{{item.abstract}}</span>
    </li>
  </ol>
</div>`
};

const Profile = { template: '<div>profile</div>' };
const Recommandation = { template: '<div>recommandation</div>' };

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
    { path: '/catalog', component: Catalog },
    { path: '/profile', component: Profile },
    { path: '/recommandation', component: Recommandation }
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