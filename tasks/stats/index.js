require('dotenv').load({silent: true})
const console = require('better-console')
const {GRAPHQL_ENDPOINT} = process.env
const {GraphQLClient} = require('graphql-request')
const fs = require('mz/fs')
const path = require('path')
const client = new GraphQLClient(GRAPHQL_ENDPOINT)

// run as CLI
;(async () => {
  await getStats().then(res => console.log(res))
})()

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

module.exports = getStats
