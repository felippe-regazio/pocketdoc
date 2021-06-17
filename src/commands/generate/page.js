const fs = require('fs');
const path = require('path');
const sass = require('sass');
const marked = require('marked');
const config = require('./config.js');
const Handlebars = require('handlebars');
const deepMergeObj = require('deepmerge');
const htmlMinify = require('html-minifier-terser').minify;
const getJsonFromStr = require('../../helpers/get-json.js');

const page = {
	extractPageMetadata(pageInfo) {
		if (!pageInfo.source) return {};

		const delimiter = config.configJson.pageMetadataDelimiter || '@';
		const globalMetadata = config.configJson.pages || {};

		if (pageInfo.source.startsWith(delimiter)) {
			const pageMetadata = getJsonFromStr(pageInfo.source)[0];

			const removeFromPage = new RegExp(`@*.+${pageMetadata.str}`);
			pageInfo.source = pageInfo.source.replace(removeFromPage, '').trim();

			return deepMergeObj(globalMetadata, pageMetadata.obj);
		}

		return {};
	},

	markdownCompile(pageInfo) {
		return marked(pageInfo.source, {
			highlight: (code, lang) => {
				const hljs = require('highlight.js');
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';
				return hljs.highlight(code, { language }).value;
			},
		});
	},

	generatePageHtmlFor(pageInfo) {
		let pageHtml = this.doHandlebars(pageInfo);

		if (pageInfo.metadata.scssStyleTagCompile) {
			pageHtml = this.compileScssStyleTags(pageHtml);
		}

		if (!pageInfo.metadata.noHtmlMinify) {
			pageHtml = this.htmlStrMinify(pageHtml);
		}

		return pageHtml;
	},

	doHandlebars(pageInfo) {
		const pageMainSource = this.getPageHbsFile('main');

		if (pageInfo.ext === '.hbs') {
			const htmlContentProcessor = Handlebars.compile(pageInfo.contentHtml, {
				noEscape: true,
				preventIndent: true,
			});

			pageInfo.contentHtml = htmlContentProcessor(pageInfo.metadata);
		}

		const hbsProcessor = Handlebars.compile(pageMainSource, {
			noEscape: true,
			preventIndent: true,
		});

		return hbsProcessor({ page: pageInfo, config: config });
	},

	getPageHbsFile(which) {
		const filePath = path.resolve(__dirname, 'page-hbs', `${which}.hbs`);

		return fs.readFileSync(filePath, 'utf-8');
	},

	htmlStrMinify(htmlStr) {
		return htmlMinify(htmlStr, {
			quoteCharacter: '"',
			removeComments: true,
			useShortDoctype: true,
			continueOnParseError: true,
		});
	},

	compileScssStyleTags(pageHtml) {
		const scssStyles = pageHtml.match(/<style *.+lang\=*.+scss\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/mg);

		scssStyles && scssStyles.forEach(scss => {
			const scssContent = scss.replace(/<[^>]*>/mg, '');
			const compiled = sass.renderSync({ data: scssContent });
			pageHtml = pageHtml.replace(scssContent, compiled.css.toString());
		});

		return pageHtml;
	},
};

page.partialsRegistered = fs.readdirSync(path.resolve(__dirname, 'page-hbs'))
	.filter(filenameext => filenameext !== 'main')
	.map(filenameext => path.parse(filenameext).name)
	.map(partialName => {
		const partial = page.getPageHbsFile(partialName);

		return Handlebars.registerPartial(partialName, partial);
	});

module.exports = page;
