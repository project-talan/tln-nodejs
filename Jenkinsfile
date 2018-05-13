node {
  def pullRequest = false;
  def commitToBuild = '';
  def branchToBuild = '';
  def repo = '';
  def org = '';
  //
  stage('checkout') {
    def scmVars = checkout scm;
    if (params.containsKey('sha1')) {
      pullRequest = true;
      echo "PR sha1: ${sha1}";
      sh 'git fetch --tags --progress origin +refs/pull/*:refs/remotes/origin/pr/*';
      commitToBuild = ghprbActualCommit;
    } else {
      commitToBuild = scmVars.GIT_COMMIT;
      branchToBuild = scmVars.GIT_BRANCH;
    }
    echo "Build info: PR:${pullRequest}, BRANCH: ${branchToBuild}, COMMIT: ${commitToBuild}";
    sh "git checkout ${commitToBuild}";
    echo sh(returnStdout: true, script: 'env');
    //
    sh 'pwd';
    sh 'ls -la';
    sh 'git status';
    sh 'git log -3';
  }
  stage('build') {
  }
  stage('test') {
  }
  stage('package') {
  }
  stage('upload') {
  }
}