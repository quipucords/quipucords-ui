@Library("smqe-shared-lib@master") _

node("openstack && discovery_ci && fedora") {
  withEnv(["DYNACONF_camayoc__use_uiv2=True"]) {
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
}
