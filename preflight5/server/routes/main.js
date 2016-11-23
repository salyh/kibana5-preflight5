import basicrules from '../rules/basicrules';
export default function (server) {

  server.route({
    path: '/api/preflight_5/example',
    method: 'GET',
    handler(req, reply) {

      const client = server.plugins.elasticsearch.client;

      Promise.all([client.cluster.health(),
                   client.cluster.getSettings(),
                   client.nodes.info(),
                   client.nodes.stats(),
                   client.cluster.stats()])
      .then(function (spread) {

        //console.log(basicrules);
        //console.log(basicrules.oddNumberOfNodes);

        let rules = [];
        rules.push(basicrules.oddNumberOfMasterNodes);
        rules.push(basicrules.mlock);
        rules.push(basicrules.maxFileDescriptors);
        rules.push(basicrules.minThreeMasterNodes);
        rules.push(basicrules.mixedEsVersions);
        rules.push(basicrules.mixedJavaVersions);
        rules.push(basicrules.oldJavaVersions);
        rules.push(basicrules.cpuCount);
        rules.push(basicrules.clusterName);
        rules.push(basicrules.pendingTasks);

        var preflightInfo = {};
        var results = [];
        var clusterStatus = {};
        clusterStatus.cluster = {};
        clusterStatus.cluster.health = spread[0];
        clusterStatus.cluster.settings = spread[1];
        clusterStatus.nodes = {};
        clusterStatus.nodes.info = spread[2];
        clusterStatus.nodes.stats = spread[3];
        clusterStatus.cluster.stats = spread[4];
        preflightInfo.clusterhealth = clusterStatus.cluster.health;
        for (let preflightRule of rules) {
          var ruleResult = {};
          for (let propertyKey in preflightRule) {
            if (preflightRule.hasOwnProperty(propertyKey)) {
              var propertyValue = preflightRule[propertyKey];
              if (typeof propertyValue === 'function') {
                ruleResult[propertyKey] = propertyValue(clusterStatus);
              } else {
                ruleResult[propertyKey] = preflightRule[propertyKey];
              }
            }
          }
          results.push(ruleResult);
        }

        preflightInfo.results = results;
        reply(preflightInfo)
      });
    }
  });
};
