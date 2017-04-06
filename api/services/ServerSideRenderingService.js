module.exports = {
  init: function (routes, createStore, template) {
    return function (req, res) {

      require('react-router').match({
        routes,
        history: createServerHistory(),
        location: req.url
      }, (error, redirectLocation, renderProps) => {
        if (error) res.status(500).send(error.message);
        else if (redirectLocation) res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        else if (renderProps) {

          const React = require('react');
          const {renderToString} = require('react-dom/server');
          const store = createStore();
          const App = createApp(store, renderProps);
          renderToString(React.createElement(App)); // used to init app and get the state

          if (checkIfReady(store.getState())) return renderPage(App, res.render, store.getState(), template); // checks if the page is ready to load

          const unsubscribe = store.subscribe(() => { // if is not ready, subscribes to state change until it is
            if (checkIfReady(store.getState())) {
              unsubscribe();
              renderPage(res.render, App, store.getState(), template);
            }
          });
        }
        else res.status(404).send('Not found');
      });

    }
  }
};


function renderPage(render, App, state, template) {
  const React = require('react');
  const {renderToStaticMarkup} = require('react-dom/server');
  const metaTags = state && state.main && state.main.metaTags;
  render(template, {
    appHtml: renderToStaticMarkup(React.createElement(App)),
    metaTagsHtml: metaTags ? metaTagsToHtml(metaTags) : ''
  });
}

function checkIfReady(state) {
  const ssrRequired = state.main.ssrRequired || [];
  if (!ssrRequired.length) return true;
  return !ssrRequired.filter(variable => !eval(`state.${variable}`)).length;
}

function createServerHistory(routes) {
  const { createMemoryHistory } = require('history');
  const useNamedRoutes = require('use-named-routes');
  return useNamedRoutes(createMemoryHistory)({ routes });
}

function createApp(store, renderProps) {
  const React = require('react');
  const { Provider } = require('react-redux');
  const { RouterContext } = require('react-router');
  return React.createElement(Provider, {store}, React.createElement(RouterContext, renderProps));
}

function metaTagsToHtml(metaTags) {
  const metaTagList = [];
  const baseUrl = sails.config.publicUrl+'/';

  // Main
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
    return `<meta ${Object.keys(metaTag).map(prop=>`${prop}=${metaTag[prop]}`).join(' ')} />`;
  }).join('\n\t');
}
