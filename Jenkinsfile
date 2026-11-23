@Library("discovery-lib@main") _

node("x86_64 && discovery_ci && fedora") {
  timestamps {
    stage("[fedora] Setup test environment") {
      echo "Setting up Quipucords PR tests"
        discoveryLib.setupCIEnv()
    }
    stage("[fedora] Run tests") {
      discoveryLib.runTests()
    }
    stage("[fedora] Archive artifacts") {
      discoveryLib.archiveArtifacts()
    }
  }
}
