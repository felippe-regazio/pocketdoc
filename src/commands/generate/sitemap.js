const config = require('./config.js');
const _builder = require('./builder.js');
const _page = require('./page.js');

module.exports = {
	create(site, autoCreateFile = true) {
		const sitemap = [];

		Object.keys(site).forEach(folder => {
			Object.keys(site[folder]).forEach(item => {
				const itemObj = site[folder][item];
				const relativePath = itemObj.relativeDir ? `/${itemObj.relativeDir}` : '';
				const endpoint = itemObj.name === 'index' ? '' : itemObj.destFileName;
				const address = `${relativePath}/${endpoint}`;

				sitemap.push({ name: itemObj.name, address });
			});
		});

		sitemap.sort((a, b) => a.address.length < b.address.length ? -1 : 1);

		const sitemapInfo = {
			ext: '.hbs',
			name: config.configJson.sitemapTitle || 'Sitemap',
			destDir: config.dest,
			destFileName: 'sitemap',
			metadata: {
				sitemap,
				title: config.configJson.sitemapTitle || 'Sitemap',
			},
			contentHtml: `
        <h1>Sitemap</h1>

        <ul id="sitemap">
          {{#each sitemap}}
            <li>
              <a href="{{address}}">
                <strong>{{name}}</strong>: {{address}}
              </a>
            </li>
          {{/each}}
        </ul>
      `,
		};

		sitemapInfo.pageHtml = _page.doHandlebars(sitemapInfo);
		autoCreateFile && _builder.createPageFile(sitemapInfo);

		return sitemapInfo;
	},
};
