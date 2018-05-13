node {
  def pullRequest = false;
  def commitToBuild = '';
  def branchToBuild = '';
  def repo = '';
  def org = '';
  //
  stage('checkout') {
    def scmVars = checkout scm;
    if (params.containsKey('sha1')){
      pullRequest = true;
      echo "Pull request build sha1: ${sha1}";
      sh 'git fetch --tags --progress origin +refs/pull/*:refs/remotes/origin/pr/*;
      commitToBuild = ghprbActualCommit;
    } else {
      echo "Build push branch: ${scmVars.GIT_BRANCH}, sha: ${scmVars.GIT_COMMIT}";
      commitToBuild = scmVars.GIT_COMMIT;
    }
    //sh "git checkout ${commitToBuild}";
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