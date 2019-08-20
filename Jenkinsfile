pipeline {
    agent { label 'f28-os' }

    environment {
        qpc_version = "${params.version_name}"
        tarfile = "${DISTRIBUTION_NAME}-ui.${qpc_version}.tar"
        targzfile = "${tarfile}.gz"
    }

    parameters {
        string(defaultValue: "master", description: 'What version?', name: 'version_name')
        choice(choices: ['branch', 'tag'], description: "Branch or Tag?", name: 'version_type')
    }

    stages {
        stage ('Build Info') {
            steps {
                echo "Version: ${params.version_name}\nVersion Type: ${params.version_type}\nCommit: ${params.GIT_COMMIT}"
            }
        }
        stage('Install') {
            steps {
                sh "sudo dnf -y install origin-clients nodejs"



            // checkout scm
            script {
                if ("${params.version_type}" == 'branch') {
                    echo "Checkout Branch"
                    checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: "${params.version_name}"]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: "${env.GIT_URL}"]]]
                }
                if ("${params.version_type}" == 'tag') {
                    echo "Checkout Tag"
                    checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: "refs/tags/${params.version_name}"]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: "${env.GIT_URL}"]]]
                }
              }


                sh "sudo setenforce 0"
            }
        }
        stage('Client Build Setup') {
            steps {
                sh "node -v"
                sh "npm -v"
                sh "sudo npm install -g n"
                sh "sudo n lts"
                sh "node -v"
                sh "npm -v"
                sh "sudo npm install yarn -g"
                sh "yarn --non-interactive"
                sh "yarn upgrade --pattern quipudocs"
            }
        }
        stage ('Test Client') {
            steps {
                sh "yarn test"
            }
        }
        stage('Build Client') {
            steps {
                sh "yarn build${UI_BUILD_FLAGS}"
            }
        }
        stage('Distribute Client Build') {
            steps {
                sh "sudo tar -cvf $tarfile dist/*"
                sh "sudo chmod 755 $tarfile"
                sh "sudo gzip -f --best $tarfile"
                sh "sudo chmod 755 $targzfile"

                archiveArtifacts targzfile
            }
        }
    }
}
