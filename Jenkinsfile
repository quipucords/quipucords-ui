def qpc_version = "0.0.47"
def image_name = "quipucords-ui:${qpc_version}"
def tarfile = "quipucords-ui.${qpc_version}.tar"
def targzfile = "${tarfile}.gz"

node('f28-os') {
    stage('Install') {
        sh "sudo dnf -y install origin-clients nodejs"
        checkout scm
        sh "sudo setenforce 0"
    }
    stage('Build Client') {
        sh "node -v"
        sh "npm -v"
        sh "sudo npm install -g n"
        sh "sudo n lts"
        sh "node -v"
        sh "npm -v"
        sh "npm install"
        sh "npm rebuild node-sass --force"
        sh "npm run build"

        sh "sudo tar -cvf $tarfile dist/*"
        sh "sudo chmod 755 $tarfile"
        sh "sudo gzip -f --best $tarfile"
        sh "sudo chmod 755 $targzfile"

        archiveArtifacts targzfile
    }
}
