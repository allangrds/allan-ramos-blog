import React, { memo } from 'react'
import algoliasearch from 'algoliasearch/lite'
import {
  InstantSearch, SearchBox, Hits, Stats,
} from 'react-instantsearch-dom'

import Hit from './Hit'
import * as S from './styles'

const algolia = {
  appId: process.env.GATSBY_ALGOLIA_APP_ID,
  indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
  searchOnlyApiKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
}

const searchClient = algoliasearch(algolia.appId, algolia.searchOnlyApiKey)

const Search = () => (
  <S.SearchWrapper>
    <InstantSearch
      searchClient={searchClient}
      indexName={algolia.indexName}
    >
      <SearchBox
        autoFocus
        translations={{ placeholder: 'Pesquisar...' }}
      />
      <Stats
        translations={{
          stats (nbHits) {
            return `${nbHits} resultados encontrados`
          },
        }}
      />
      <Hits
        hitComponent={Hit}
      />
    </InstantSearch>
  </S.SearchWrapper>
)

export default memo(Search)
