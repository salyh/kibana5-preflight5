import jsonPath from 'jsonpath-plus';

module.exports.maxFileDescriptors = {
  title: 'Check number of max filedescriptors',
  description: function (clusterStatus) {
    return `The maximum number of file descriptors on every node should be >= 64000.`
    + ` ${calculateNodesCountWithBadMaxFileDesc(clusterStatus)} nodes are beneath this minimum.`;
  },
  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {
    let nodes = calculateNodesCountWithBadMaxFileDesc(clusterStatus)
    let ruleStatus;
    if (nodes > 0) {
      ruleStatus = 2;
    } else {
      ruleStatus = 0;
    }
    return ruleStatus;
    }
};

module.exports.mlock = {
  title: 'Check mlock',
  description: function (clusterStatus) {
    return `All nodes should have mlock activated.`
    + ` On ${calculateNodesCountWithNoMlock(clusterStatus)} nodes mlock is not activated.`;
  },
  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {
    let nodes = calculateNodesCountWithNoMlock(clusterStatus)
    let ruleStatus;
    if (nodes > 0) {
      ruleStatus = 2;
    } else {
      ruleStatus = 0;
    }
    return ruleStatus;
    }
};




module.exports.oddNumberOfMasterNodes = {
  title: 'Odd Number of master eligible nodes',
  description: function (clusterStatus) {
    return `The cluster should contain an odd number of master eligible nodes. Cluster `
    + `currently has ${clusterStatus.cluster.stats.nodes.count.master} master eligible node(s) `
    + `installed.`;
  },
  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {
    let numberOfMasterNodes = clusterStatus.cluster.stats.nodes.count.master;
    let ruleStatus;
    if (numberOfMasterNodes % 2 === 0) {
      ruleStatus = 2;
    } else {
      ruleStatus = 0;
    }
    return ruleStatus;
  }
};

module.exports.minThreeMasterNodes = {
  title: 'Minimum of three dedicated master nodes and no mixed master/data nodes',
  description: function (clusterStatus) {
    return `The cluster should at least have three dedicaded master nodes and no mixed master/data nodes. `
    + `Currently it has ${calculateMasterOnlyNodesCount(clusterStatus)} dedicated master node(s) and `
    + `${calculateMixedMasterDataNodesCount(clusterStatus)} mixed master/data nodes installed.`;
  },
  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {

    let numberOfMasterNodes = calculateMasterOnlyNodesCount(clusterStatus);
    let ruleStatus;
    if (numberOfMasterNodes < 3 || calculateMixedMasterDataNodesCount(clusterStatus) > 0) {
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
    console.log(esVersions)
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
    console.log(jvmVersions)
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
    console.log(jvm)
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
    console.log(jvm)
    let ruleStatus;
    if (jvm.version.indexOf('1.7') > -1 || jvm.vm_vendor.indexOf('Oracle') == -1) {
      ruleStatus = 1;
    } else {
      ruleStatus = 0;
    }
    return ruleStatus;
  }
};

module.exports.clusterName = {
  title: 'Cluster name should not be "elasticsearch"',

  description: function (clusterStatus) {
    return `Cluster name should not be "elasticsearch"`
    + ` is (${clusterStatus.cluster.health.cluster_name}) `;
  },

  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {

    let cluster_name = clusterStatus.cluster.health.cluster_name;
    let ruleStatus;
    if (cluster_name == "elasticsearch") {
      ruleStatus = 1;
    } else {
      ruleStatus = 0;
    }
    return ruleStatus;
  }
};

module.exports.pendingTasks = {
  title: 'Check that not to many tasks are pending',

  description: function (clusterStatus) {
    return `Pending tasks should not be too high. Current task count is "`
    + ` is (${clusterStatus.cluster.health.number_of_pending_tasks}) `;
  },

  reference: 'https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-node.html',
  status: function (clusterStatus) {

    let pending_tasks = clusterStatus.cluster.health.number_of_pending_tasks;
    let ruleStatus;
    if (pending_tasks < 100) {
      ruleStatus = 0;
    } else if (pending_tasks < 300) {
      ruleStatus = 1;
    } else {
      ruleStatus = 2;
    }
    return ruleStatus;
  }
};



function calculateMasterOnlyNodesCount(clusterStatus) {
  var roles = jsonPath({wrap: false}, '$.nodes.*.roles', clusterStatus.nodes.info);
  var dedicatedMasterCount = 0;

  roles.forEach(function(n){
     if(n.length == 1 && n[0] == "master") {
       dedicatedMasterCount++;
     }
  });

  return dedicatedMasterCount
}

function calculateMixedMasterDataNodesCount(clusterStatus) {
  var roles = jsonPath({wrap: false}, '$.nodes.*.roles', clusterStatus.nodes.info);
  var mixedCount = 0;

  roles.forEach(function(n){
     if(n.indexOf("master") > -1 && n.indexOf("data") > -1) {
       mixedCount++;
     }
  });

  return mixedCount
}

function calculateNodesCountWithBadMaxFileDesc(clusterStatus) {
  var mfd = jsonPath({wrap: false}, '$.nodes.*.process.max_file_descriptors', clusterStatus.nodes.stats);
  var count = 0;

  if( Object.prototype.toString.call( mfd ) === '[object Array]' ) {
    mfd.forEach(function(n){
       if(n < 64000) {
         count++;
       }
    });
  } else {
    if(mfd < 64000) {
      count++;
    }
  }



  return count
}

function calculateNodesCountWithNoMlock(clusterStatus) {
  var mlck = jsonPath({wrap: false}, '$.nodes.*.process.mlockall', clusterStatus.nodes.info);
  var count = 0;

  if( Object.prototype.toString.call( mlck ) === '[object Array]' ) {
    mlck.forEach(function(n){
       if(n == false) {
         count++;
       }
    });
  } else {
    if(mlck == false) {
      count++;
    }
  }
  return count
}

//2 = red,
//1=yellow
//0=green
