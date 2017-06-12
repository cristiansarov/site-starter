import React from 'react';
import { match } from 'react-router'
import getRoutes from './core/config/getRoutes';
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import createHistory from './core/config/server/createHistory';
import createStore from './core/config/server/createStore';
import createApp from './core/config/server/createApp';
import hash from '../dist/hash';



module.exports = {
  route: function (req, res) {
    HelperService.getPageData().then(data=>{

      const {i18nKeys, appRoutes} = data;
      const routes = getRoutes(appRoutes);
      const history = createHistory(routes);

      match({routes, history, location: req.url}, (error, redirectLocation, renderProps) => {
        if (error) res.status(500).send(error.message);
        else if (redirectLocation) res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        else if (renderProps) {

          const store = createStore();
          const App = createApp(store, renderProps, i18nKeys);
          renderToString(<App />); // used to init app and get the state

          if (checkIfReady(store.getState())) { // checks if the page is ready to load
            return renderPage(store, renderProps);
          }

          const unsubscribe = store.subscribe(() => { // if is not ready, subscribes to state change until it is
            if (checkIfReady(store.getState())) {
              unsubscribe();
              renderPage(store, renderProps);
            }
          });
        }
        else res.status(404).send('Not found');
      });

      function renderPage(store, renderProps) {
        setTimeout(()=>{
          const state = store.getState();
          const metaTags = state.main.metaTags;
          const initialState = {};
          state.main.ssrRequired && state.main.ssrRequired.forEach(item => {
            const key = item.split('.')[0];
            initialState[key] = state[key];
          });
          const updatedStore = createStore(state);
          const App = createApp(updatedStore, renderProps, i18nKeys);
          let status = 200;
          if(renderProps.routes[renderProps.routes.length-1].path=='*') status = 404; // if the route doesn't match anything
          if(state.main.notFoundState) { // is notFoundState is set, see if the page is 404
            try {
              if(eval(`state.${state.main.notFoundState}`)) status = 404;
            } catch(err) {}
          }
          res.status(status).render('index.ejs', {
            appHtml: renderToStaticMarkup(<App />),
            metaTagsHtml: metaTags ? metaTagsToHtml(metaTags) : '',
            hash,
            initialState
          });
        })
      }

      function checkIfReady(state) {
        const ssrRequired = state.main.ssrRequired || [];
        if (!ssrRequired.length) return true;
        return !ssrRequired.filter(variable => !eval(`state.${variable}`)).length;
      }

      function metaTagsToHtml(metaTags) {
        const metaTagList = [];
        const baseUrl = sails.config.publicUrl+'/';

        // Layout
        if(metaTags.title)        metaTagList.push({title: metaTags.title});
        if(metaTags.image)        metaTagList.push({image: baseUrl+metaTags.image});
        if(metaTags.description)  metaTagList.push({name: 'description',          content: metaTags.description});

        // Facebook (Open Graph)
        if(metaTags.title)        metaTagList.push({property: 'og:title',         content: metaTags.title});
        if(metaTags.description)  metaTagList.push({property: 'og:description',   content: metaTags.description}); // 70 - 150 chars, 2-4 sentences
        if(metaTags.image)        metaTagList.push({property: 'og:image',         content: baseUrl+metaTags.image}); // 1200 x 630 px
        if(metaTags.image)        metaTagList.push({property: 'og:image:secure_url',content: baseUrl.replace('http', 'https')+metaTags.image}); // 1200 x 630 px
        if(metaTags.type)         metaTagList.push({property: 'og:type',          content: metaTags.type}); // website, article

        // Google Plus
        if(metaTags.title)        metaTagList.push({itemProp: 'name',             content: metaTags.title});
        if(metaTags.description)  metaTagList.push({itemProp: 'description',      content: metaTags.description}); // 70 - 150 chars, 2-4 sentences
        if(metaTags.image)        metaTagList.push({itemProp: 'image',            content: baseUrl+metaTags.image}); // 506 x 211px

        // Twitter
        if(metaTags.title)        metaTagList.push({name: 'twitter:title',        content: metaTags.title}); // max 70 chars
        if(metaTags.description)  metaTagList.push({name: 'twitter:description',  content: metaTags.description}); // 70 - 150 chars, max 200 chars
        if(metaTags.image)        metaTagList.push({name: 'twitter:image',        content: baseUrl+metaTags.image}); // 440 x 220 px

        return metaTagList.map(metaTag=> {
          if(metaTag.title) return `<title>${metaTag.title}</title>`;
          if(metaTag.image) return `<link rel="image_src" href="${metaTag.image}" />`;
          return `<meta ${Object.keys(metaTag).map(prop=>`${prop}="${metaTag[prop]}"`).join(' ')} />`;
        }).join('\n\t');
      }

    }).catch(err => {
      res.negotiate(err);
    });
  }
};