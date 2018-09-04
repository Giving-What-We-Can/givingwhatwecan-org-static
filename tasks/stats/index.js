require('dotenv').load({silent: true})
const console = require('better-console')
const {GRAPHQL_ENDPOINT} = process.env
const {GraphQLClient} = require('graphql-request')
const fs = require('mz/fs')
const path = require('path')
const retry = require('async-retry')

const client = new GraphQLClient(GRAPHQL_ENDPOINT)
const STATS_FILEPATH = path.join(__dirname, path.normalize('../../src/metalsmith/settings/stats.json'))

  // 'numberofmembers',
  // 'amountpledged',
  // 'amountpledgedwords',
  // 'amountdonatedsofar',
  // 'igivechart',
  // 'igivechartwithoutother',
  // 'citieschart',
  // 'chaptermap',
  // 'listofmembers'

async function getStats () {
  // get all pledges
  const allPledgesQuery = await fs.readFile(path.join(__dirname, 'statsQuery.gql'), 'utf8')
  return client.request(allPledgesQuery).then(flattenGQLResponse)
}

function flattenGQLResponse (res) {
  const flatResponse = {}
  for (let key in res) {
    if (res[key].edges) {
      flatResponse[key] = res[key].edges.map(edge => edge.node)
    } else {
      flatResponse[key] = res[key]
    }
  }
  return flatResponse
}

// ============================ //
if (require.main === module) {
  // run as CLI with retry
  (async () => {
    try {
      const stats = await retry(async (bail, n) => {
        console.log(`Getting GWWC stats...${n > 1 ? ` (attempt ${n})`: ''}`)
        return getStats()
      }, {retries: 5})
      await fs.writeFile(STATS_FILEPATH, JSON.stringify(stats, null, 2))
      console.log(`Stats written to ${STATS_FILEPATH}`)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  })()
} else {
  // export as module
  module.exports = getStats
}
