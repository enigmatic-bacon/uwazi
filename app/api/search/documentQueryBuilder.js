
export default function () {
  let baseQuery = {
    _source: {
      include: [ 'doc.title', 'doc.processed', 'doc.creationDate', 'doc.template', 'doc.metadata', 'doc.type']
    },
    from: 0,
    size: 12,
    query: {
      bool: {
        must: [
          {match_all: {}}
        ]
      }
    },
    sort: [],
    filter: {
      bool: {
        must: [
          {match: {'doc.published': true}}
        ]
      }
    },
    aggregations: {

    }
  };

  return {
    query() {
      return baseQuery;
    },

    fullTextSearch(term, fieldsToSearch = ['doc.fullText', 'doc.title']) {
      if (term) {
        baseQuery.query.bool.must.push({
          multi_match: {
            query: term,
            type: 'phrase_prefix',
            fields: fieldsToSearch
          }
        });
      }
      return this;
    },

    sort(property, order = 'desc') {
      let sort = {};
      sort[`doc.${property}`] = {order, ignore_unmapped: true};
      baseQuery.sort.push(sort);
      return this;
    },

    filterMetadata(filters = {}) {
      Object.keys(filters).forEach((property) => {
        if (filters[property].type === 'text') {
          let match = {};
          match[`doc.metadata.${property}`] = filters[property].value;
          baseQuery.filter.bool.must.push({match});
        }

        if (filters[property].type === 'range') {
          let range = {};
          range[`doc.metadata.${property}`] = {gte: filters[property].value.from, lte: filters[property].value.to};
          baseQuery.filter.bool.must.push({range});
        }

        if (filters[property].type === 'multiselect') {
          let terms = {};
          terms[`doc.metadata.${property}`] = filters[property].value;
          baseQuery.query.bool.must.push({terms});
        }
      });
      return this;
    },

    aggregations(properties) {
      properties.forEach((property) => {
        baseQuery.aggregations[property] = {terms: {field: `doc.metadata.${property}.raw`}};
      });

      return this;
    },

    filterByTemplate(templates = []) {
      if (templates.length) {
        let match = {bool: {
          should: [],
          minimum_should_match: 1
        }};

        templates.forEach((templateId) => {
          match.bool.should.push({match: {'doc.template': templateId}});
        });

        baseQuery.filter.bool.must.push(match);
      }
      return this;
    },

    highlight(fields) {
      baseQuery.highlight = {
        pre_tags : ['<b>'],
        post_tags : ['</b>']
      };
      baseQuery.highlight.fields = {};
      fields.forEach((field) => {
        baseQuery.highlight.fields[field] = {};
      });
      return this;
    },

    from(from) {
      baseQuery.from = from;
      return this;
    },

    limit(size) {
      baseQuery.size = size;
      return this;
    }
  };
}
