import jsonPath from 'jsonpath-plus';

module.exports.test = {
  title: 'Odd Number of Number Nodes',
  description: 'The cluster should contain an odd number of nodes',
  status: 1
};

module.exports.oddNumberOfNodes = {
  title: 'Odd Number of Number Nodes',
  description: function (clusterStatus) {
    return `The cluster should contain an odd number of nodes. Cluster `
    + `currently has ${clusterStatus.cluster.health.number_of_nodes} node(s) `
    + `installed.`;
  },
  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {
    let numberOfNodes = jsonPath({wrap: false}, '$..number_of_nodes', clusterStatus);
    let ruleStatus;
    if (numberOfNodes % 2 === 0) {
      ruleStatus = 2;
    } else {
      ruleStatus = 0;
    }
    return ruleStatus;
  }
};

module.exports.oddNumberOfDataNodes = {
  title: 'Odd Number of Data Number Nodes',
  description: 'The cluster should contain an odd number of data nodes',
  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {

    let numberOfDataNodes = jsonPath({wrap: false}, '$..number_of_data_nodes', clusterStatus);
    let ruleStatus;
    if (numberOfDataNodes % 2 === 0) {
      ruleStatus = 2;
    } else {
      ruleStatus = 0;
    }
    return ruleStatus;
  }
};

module.exports.minThreeMasterNodes = {
  title: 'Minimum of three dedicated master nodes and no mixed master/data nodes',
  description: 'The cluster should at least have three dedicaded master nodes and no mixed master/data nodes',
  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {

    let numberOfMasterNodes = jsonPath({wrap: false}, '$.nodes.count.master_only', clusterStatus.cluster.stats);
    let ruleStatus;
    if (clusterStatus.cluster.stats.nodes.count.master_only < 3 || clusterStatus.cluster.stats.nodes.count.master_data > 0) {
      ruleStatus = 2;
    } else {
      ruleStatus = 0;
    }
    return ruleStatus;
  }
};

module.exports.mixedEsVersions = {
  title: 'Different Elasticsearch versions in the cluster',
  description: 'All nodes in the cluster should ideally have the same Elasticsearch Version',
  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {

    let esVersions = jsonPath({wrap: false}, '$.nodes.versions', clusterStatus.cluster.stats);
    let ruleStatus;
    if (esVersions.length > 1) {
      ruleStatus = 1;
    } else {
      ruleStatus = 0;
    }
    return ruleStatus;
  }
};

module.exports.mixedJavaVersions = {
  title: 'Different JVM versions in the cluster',
  description: 'All nodes in the cluster should have the same Java version',
  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {

    let jvmVersions = jsonPath({wrap: false}, '$.nodes.jvm.versions', clusterStatus.cluster.stats);
    let ruleStatus;
    if (jvmVersions.length > 1) {
      ruleStatus = 1;
    } else {
      ruleStatus = 0;
    }
    return ruleStatus;
  }
};

module.exports.oldJavaVersions = {
  title: 'Oracle Java 8 Server VM should be used as JVM',
  description: 'Oracle Java 8 Server VM should be used as JVM, Java 1.7 is no longer supported by Oracle',
  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {

    let jvm = jsonPath({wrap: false}, '$.nodes.jvm.versions[0]', clusterStatus.cluster.stats);
    let ruleStatus;
    if (jvm.version.indexOf('1.7') > -1 || jvm.vm_vendor.indexOf('Oracle') == -1 || jvm.vm_name.indexOf('Server') == -1) {
      ruleStatus = 1;
    } else {
      ruleStatus = 0;
    }
    return ruleStatus;
  }
};

module.exports.cpuCount = {
  title: 'Data Nodes should have at least 4 cpu cores',
  description: 'Data Nodes should have at least 4 cpu cores',
  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {

    let jvm = jsonPath({wrap: false}, '$.nodes.jvm.versions[0]', clusterStatus.cluster.stats);
    let ruleStatus;
    if (jvm.version.indexOf('1.7') > -1 || jvm.vm_vendor.indexOf('Oracle') == -1) {
      ruleStatus = 1;
    } else {
      ruleStatus = 0;
    }
    return ruleStatus;
  }
};

//cluster name not default
//multicast disabled
//http://asquera.de/opensource/2012/11/25/elasticsearch-pre-flight-checklist/
//memory
//mlockall
