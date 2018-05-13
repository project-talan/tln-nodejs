node {
  def pullRequest = false;
  def commitToBuild = '';
  def branchToBuild = '';
  def repo = '';
  def org = '';
  //
  stage('checkout') {
    //
    def scmVars = checkout scm;
    if (params.containsKey('sha1')) {
      pullRequest = true;
      echo "== PR sha1: ${sha1}";
      sh 'git fetch --tags --progress origin +refs/pull/*:refs/remotes/origin/pr/*';
      commitToBuild = ghprbActualCommit;
    } else {
      commitToBuild = scmVars.GIT_COMMIT;
      branchToBuild = scmVars.GIT_BRANCH;
    }
    echo "== Build info: PR:${pullRequest}, BRANCH: ${branchToBuild}, COMMIT: ${commitToBuild}";
    //sh "git checkout ${commitToBuild}";
    //
    sh 'envsubst < .env.template > .env';
    sh 'cat ./.env';
    //
    echo sh(returnStdout: true, script: 'env');
    //
  }
  stage('build') {
    sh './build.sh';
  }
  stage('test') {
    sh './test.sh';
  }
  stage('package') {
  }
  stage('upload') {
  }
}