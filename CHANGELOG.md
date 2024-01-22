# Changelog

All notable changes to this project will be documented in this file.

## 1.6.2 (2024-01-22)


### Chores
*  add .noai to disable Jetbrains AI Assistant  (40f06a8)
* **deps** bump redux from 4.2.1 to 5.0.1  (#279) (14901ba)
* **deps-dev** bump npm-check-updates from 16.13.1 to 16.14.12  (#280) (41406a0)
* **deps-dev** bump @babel/preset-env from 7.22.10 to 7.23.5  (#264) (3d66168)
* **deps-dev** bump glob from 10.3.3 to 10.3.10  (#256) (352fe42)
* **deps** bump actions/setup-node from 3 to 4  (#255) (d73828d)
* **deps** bump actions/github-script from 6 to 7  (#262) (73585fd)
* **deps-dev** bump sass from 1.66.1 to 1.69.5  (#257) (00a285f)

## 1.6.1 (2023-11-10)


### Documentation
*  stop recommending the "dev" branch  (b8f1f6f)
*  update CONTRIBUTING release instructions  (370b068)

### Chores
* **deps-dev** eslint-plugin-jsdoc from 46.5.0 to 46.8.2  (#250) (b525cf9)
* **deps-dev** cspell from 7.0.1 to 7.3.8  (#253) (42191ed)
* **deps** actions/checkout from 3 to 4  (#247) (b92ea2a)

### Bug Fixes
* **rhacs** use appropriate naming conventions  (#258) (28ee440)

## 1.6.0 (2023-10-17)


### Features
* **acs** add support for acs data source  (#251) (e1faafc)

### Code Refactoring
* **scans** discovery-423 disable scan merge reports  (#243) (12fc5f4)

### Chores
* **deps-dev** bump eslint from 8.47.0 to 8.50.0  (#246) (62cec9e)
* **deps-dev** jest-environment-jsdom from 29.6.2 to 29.7.0  (#245) (10949a9)
* **deps-dev** jest-resolve from 29.6.2 to 29.7.0  (#244) (69ec992)
* **deps** ncipollo/release-action from 1.12.0 to 1.13.0  (#242) (d43ab54)
* **deps** npm updates  (#238) (b65a9a3)

### Bug Fixes
* **scripts** allow podman and docker  (#237) (ae03ebf)

## 1.5.1 (2023-08-23)


### Code Refactoring
* **testing** DISCOVERY-280 Add attributes to aid UI tests  (#235) (1fe16d5)

### Chores
* **deps-dev** bump eslint-config-prettier from 8.8.0 to 8.9.0  (#233) (2c0dbe4)

## 1.5.0 (2023-08-02)


### Documentation
*  rename master branch to main  (779284f)

### Code Refactoring
* **testing** react testing, handler context wrappers  (#229) (0a14eca)
* **testing** migrate from enzyme  (#227) (0e4f798)

### Chores
* **deps-dev** eslint-plugin-jest from 27.2.2 to 27.2.3  (#232) (45aedde)
* **deps-dev** bump babel-loader from 9.1.2 to 9.1.3  (#231) (8a8fe46)
* **dependabot** open pr limit, target branch  (#226) (6244d3b)
* **deps** npm updates  (#226) (1b4bb76)
* **deps-dev** bump webpack from 5.86.0 to 5.88.1  (#225) (1a58b43)
*  remove unused Jenkinsfile  (8c71990)

### Builds
* **babel** update presets, targets  (06461bd)

## 1.4.0 (2023-06-29)


### Features
* **pageLayout** discovery-334 update to pf4  (#210) (e670215)

### Documentation
* **readme,contributing** discovery-330 in-depth workflows  (#214) (2cdc80a)

### Chores
* **deps** codecov/codecov-action from 3.1.3 to 3.1.4  (#211) (49d468a)

### Builds
* **docs** DISCOVERY-357 Stop building docs pages  (7b0fa0f)
* **deps** discovery-330 core npm script  (#213) (2dec3d5)
* **webpack** discovery-334 webpack 5  (#209) (2fd67e6)

### Bug Fixes
* **formGroup** discovery-330 pf id to fieldId  (#217) (33b43de)
* **deps** discovery-330 resolve test warnings  (#216) (20b3303)
* **deps** discovery-330 pf react-core update  (#216) (f72808b)
* **deps** discovery-330 npm updates  (#216) (6245917)
* **createCredential** DISCOVERY-363 Use ssh_passphrase  (#221) (ccd62b7)
* **pageLayout** DISCOVERY-357 remove quipudocs links  (91ce87f)

## [1.3.0](https://github.com/quipucords/quipucords-ui/compare/6ff43b4e466bd75de36f4533d4e0255f9a1b47b9...59b2e37f3fe225c346f2e35174571dcb84bfc98d) (2023-06-07)

### Features
* **scans** discovery-76 adds delete functionality  ([#208](https://github.com/quipucords/quipucords-ui/pull/208)) ([59b2e37](https://github.com/quipucords/quipucords-ui/commit/59b2e37f3fe225c346f2e35174571dcb84bfc98d))

### Documentation
* **CONTRIBUTING.md** workaround for ERR_OSSL_EVP_UNSUPPORTED  ([#205](https://github.com/quipucords/quipucords-ui/pull/205)) ([a2f4151](https://github.com/quipucords/quipucords-ui/commit/a2f4151168be0e841000f8ee70db92582f124d63))

### Chores
* **deps** codecov/codecov-action from 3.1.1 to 3.1.3  ([#202](https://github.com/quipucords/quipucords-ui/pull/202)) ([8d2713a](https://github.com/quipucords/quipucords-ui/commit/8d2713aa79d421ee84e61205225fc980b9ed56f3))
* **deps-dev** changelog-light from 0.2.3 to 0.3.0  ([#199](https://github.com/quipucords/quipucords-ui/pull/199)) ([258adcc](https://github.com/quipucords/quipucords-ui/commit/258adcc4c703b42d40150cffc5cfbe4b3635bc68))

## [1.2.0](https://github.com/quipucords/quipucords-ui/compare/6cee2723944d9bc7b4b3ded6aca9d5650713fe28...a7e1bddedca77f2ad8f95a8af2e0e858ee6a98ed) (2023-04-14)

### Features
* **ansible-controller** add support for ansible data source  ([45cee58](https://github.com/quipucords/quipucords-ui/commit/45cee588cdf69395b825b88723e93d76aaa3619d))

### Chores
* **build** nodejs 14 to 16  ([#197](https://github.com/quipucords/quipucords-ui/pull/197)) ([30bdc9f](https://github.com/quipucords/quipucords-ui/commit/30bdc9f118033ecfd3e852e40d4765ee48c1780a))
* **deps** ncipollo/release-action from 1.11.2 to 1.12.0  ([#196](https://github.com/quipucords/quipucords-ui/pull/196)) ([823780e](https://github.com/quipucords/quipucords-ui/commit/823780ec9911aaa35581b9c1fde561d0221120d0))
* **deps-dev** changelog-light from 0.2.1 to 0.2.3  ([#195](https://github.com/quipucords/quipucords-ui/pull/195)) ([b28e1a3](https://github.com/quipucords/quipucords-ui/commit/b28e1a31055433b3149ce2c81606c8dff400503e))
* **deps** ncipollo/release-action from 1.10.0 to 1.11.2  ([#193](https://github.com/quipucords/quipucords-ui/pull/193)) ([f6e1464](https://github.com/quipucords/quipucords-ui/commit/f6e1464c40d7eec70d6bcc5deb238d83a18734b7))

### Bug Fixes
* script for stage container ([a7e1bdd](https://github.com/quipucords/quipucords-ui/commit/a7e1bddedca77f2ad8f95a8af2e0e858ee6a98ed))

## [1.1.1](https://github.com/quipucords/quipucords-ui/compare/e6537bd5eb5c4cc87a804d69f8155d0bdbda1834...62ced03f639c1f6eeb5285b2528fc524fa0ffd4f) (2022-11-23)

### Bug Fixes
* **addSourceWizard** discovery-178 sslCert default  (#189) (e6537bd)

##  [1.1.0](https://github.com/quipucords/quipucords-ui/compare/edc4065f6786b9c332756b2b2a0abbfa70780ad1...1ac30164a170229d95bbacc01169b7674ad5b407) (2022-11-08)

### Features
* **addSource,createCredential** discovery-203 openshift  ([#185](https://github.com/quipucords/quipucords-ui/pull/185)) ([1ac3016](https://github.com/quipucords/quipucords-ui/commit/1ac30164a170229d95bbacc01169b7674ad5b407))
* **viewContext** expose inferred context  ([#184](https://github.com/quipucords/quipucords-ui/pull/184)) ([fb57dab](https://github.com/quipucords/quipucords-ui/commit/fb57dab7809a36bfc3a762df37b325c158534d81))

### Code Refactoring
* **createCredentialDialog** class to function, hooks  ([#184](https://github.com/quipucords/quipucords-ui/pull/184)) ([61c7fec](https://github.com/quipucords/quipucords-ui/commit/61c7fec821fe6102907a59dd30ceb58146b1a46b))

### Bug Fixes
* **createCredentialDialog** locale strings  ([#185](https://github.com/quipucords/quipucords-ui/pull/185)) ([8490199](https://github.com/quipucords/quipucords-ui/commit/8490199f95798ea7d30e63b1fc83ff4cc688ef56))
* **scanJobsList** minor test correction  ([#184](https://github.com/quipucords/quipucords-ui/pull/184)) ([6adf7e3](https://github.com/quipucords/quipucords-ui/commit/6adf7e3e313ba40722f9bbc6aeb7a40360327c48))

##  [1.0.0](https://github.com/quipucords/quipucords-ui/compare/184defce82aa3d6b0cb5542ed34e81c581edef71...26b6eb0629537148fe57ffa468b412df3369aa0e) (2022-10-26)

### Performance Improvements
* **toastNotificationsList** toasts to hooks  ([#180](https://github.com/quipucords/quipucords-ui/pull/180)) ([4dc3331](https://github.com/quipucords/quipucords-ui/commit/4dc33310450c9ad1867873ed98a3caad776c3d0c))
* **app** app base to hooks  ([#180](https://github.com/quipucords/quipucords-ui/pull/180)) ([eef93d9](https://github.com/quipucords/quipucords-ui/commit/eef93d90604c95b6452e8619638a9e7ba682d426))

### Features
* **viewContext** discovery-151 context for views  ([#173](https://github.com/quipucords/quipucords-ui/pull/173)) ([55a9e58](https://github.com/quipucords/quipucords-ui/commit/55a9e58bec53fe239c4cfe54108965e90ac15612))

### Code Refactoring
* **scanDownload** class to function, hooks  ([#180](https://github.com/quipucords/quipucords-ui/pull/180)) ([da5a8c4](https://github.com/quipucords/quipucords-ui/commit/da5a8c490a511c5f1b0c4a3affee56e7604e8faa))
* **locale** component strings  ([#179](https://github.com/quipucords/quipucords-ui/pull/179)) ([5c22489](https://github.com/quipucords/quipucords-ui/commit/5c224892980329654a36c04db8505ef9fcc7f8c5))
* **addSourceWizard,createScanDialog** discovery-153 forms  ([#174](https://github.com/quipucords/quipucords-ui/pull/174)) ([0f7e9f7](https://github.com/quipucords/quipucords-ui/commit/0f7e9f7934b3a0b7d17c10a47d012d08d93b23dc))
* **scanJobsList,sourceList** discovery-154, pf4 table  ([#174](https://github.com/quipucords/quipucords-ui/pull/174)) ([220857c](https://github.com/quipucords/quipucords-ui/commit/220857c23c5a5d58816b1518a81aaa0ff8f2d88c))
* **addSourceWizard,createScanDialog** locale strings   ([#162](https://github.com/quipucords/quipucords-ui/pull/162)) ([586967a](https://github.com/quipucords/quipucords-ui/commit/586967ab84aa2df2aeec800f993278de189ac388))
* **viewToolbar** discovery-151 pf4 toolbar  ([#172](https://github.com/quipucords/quipucords-ui/pull/172)) ([c2db2ff](https://github.com/quipucords/quipucords-ui/commit/c2db2ff0b644410aa202c8142fb85d1b0780042c))
* **createCredentialDialog** discovery-153 pf4 textInput  ([#161](https://github.com/quipucords/quipucords-ui/pull/161)) ([ce1868a](https://github.com/quipucords/quipucords-ui/commit/ce1868ab19c73a7ece67356a037ddea16235b86c))
* **addSourceWizardStepTwo** discovery-153 pf4 textInput  ([#159](https://github.com/quipucords/quipucords-ui/pull/159)) ([d1192c4](https://github.com/quipucords/quipucords-ui/commit/d1192c43857578b781105cc17a8458ae4c9b5b0d))
* **textArea** discovery-153 pf4 textArea  ([#158](https://github.com/quipucords/quipucords-ui/pull/158)) ([3358126](https://github.com/quipucords/quipucords-ui/commit/33581267f230ebc0ac2f840f468862ffb67fae9f))
* **checkbox** discovery-153 pf4 checkbox  ([#155](https://github.com/quipucords/quipucords-ui/pull/155)) ([dd55ac0](https://github.com/quipucords/quipucords-ui/commit/dd55ac09b95be47d720dbcc2b95c8a37537fb88e))
* **radio** discovery-153 pf4 radio  ([#153](https://github.com/quipucords/quipucords-ui/pull/153)) ([4c99c05](https://github.com/quipucords/quipucords-ui/commit/4c99c05416e08521b3242563ca198884ebb27b4d))
* **formGroup** discovery-153 pf4 formGroup  ([#150](https://github.com/quipucords/quipucords-ui/pull/150)) ([5f5c4f6](https://github.com/quipucords/quipucords-ui/commit/5f5c4f6d022cbcfbabd159d48e33ccf231150c09))
* **touchspin** discovery-153 pf4 textInput  ([#147](https://github.com/quipucords/quipucords-ui/pull/147)) ([1be4616](https://github.com/quipucords/quipucords-ui/commit/1be461692e694812728f8da41c000e106b4a4efd))

### Chores
* **build** discovery-159 generated changelog  ([#181](https://github.com/quipucords/quipucords-ui/pull/181)) ([73939d8](https://github.com/quipucords/quipucords-ui/commit/73939d895cd7ed26f63a10e89650505c907d914d))
* **deps** bump codecov/codecov-action from 3.1.0 to 3.1.1  ([#176](https://github.com/quipucords/quipucords-ui/pull/176)) ([255bc01](https://github.com/quipucords/quipucords-ui/commit/255bc019d83f11c4a9149c01001b191b13b2e86d))
* **poll,sourceConstants** clean up unused files  ([#174](https://github.com/quipucords/quipucords-ui/pull/174)) ([48c201d](https://github.com/quipucords/quipucords-ui/commit/48c201dbf6e6bf8f44050c739fc6d90e96ac07ce))
* **deps** bump classnames from 2.3.1 to 2.3.2  ([#175](https://github.com/quipucords/quipucords-ui/pull/175)) ([d6453af](https://github.com/quipucords/quipucords-ui/commit/d6453af1f19eb3b99b9375e6b9eba9e49625fa8b))

### Bug Fixes
* **build** discovery-198 replace assets paths  ([#182](https://github.com/quipucords/quipucords-ui/pull/182)) ([26b6eb0](https://github.com/quipucords/quipucords-ui/commit/26b6eb0629537148fe57ffa468b412df3369aa0e))
* **credentialsTableCells** discovery-197 auth type string  ([#183](https://github.com/quipucords/quipucords-ui/pull/183)) ([68ea5d9](https://github.com/quipucords/quipucords-ui/commit/68ea5d9e4e5907ce35c87254ca315bccc1dfd2ae))
* **credentials,scans,sources** center pending modal  ([#180](https://github.com/quipucords/quipucords-ui/pull/180)) ([94739bc](https://github.com/quipucords/quipucords-ui/commit/94739bccb499701353bdb0b7678573e8867f14f3))
* **credentialsContext,sourcesContext** delete messaging  ([#177](https://github.com/quipucords/quipucords-ui/pull/177)) ([5bbc734](https://github.com/quipucords/quipucords-ui/commit/5bbc734efce7f36382c30a7669120703966df8ed))
* **credentialsTableCells** discovery-154 sources icon  ([#177](https://github.com/quipucords/quipucords-ui/pull/177)) ([0f650d5](https://github.com/quipucords/quipucords-ui/commit/0f650d5adb402dfbefc8c7069f9194a47dd626d4))
* **formGroup** discovery-153 use validatedOptions  ([#161](https://github.com/quipucords/quipucords-ui/pull/161)) ([68e89a8](https://github.com/quipucords/quipucords-ui/commit/68e89a89a870a1c6f9a99e59e70397ee138550c3))
* **textInput** discovery-151 state, callback sequence  ([#159](https://github.com/quipucords/quipucords-ui/pull/159)) ([4e2012a](https://github.com/quipucords/quipucords-ui/commit/4e2012a48dfb64b66de9db9bc3347542184fc5a3))
* **addSourceWizardStepTwo** invalid step check  ([#158](https://github.com/quipucords/quipucords-ui/pull/158)) ([1906783](https://github.com/quipucords/quipucords-ui/commit/190678345662fc8c71f13f6f162647843cdcf172))
* **touchspin** discovery-153 revert state value  ([#150](https://github.com/quipucords/quipucords-ui/pull/150)) ([dcd8c0b](https://github.com/quipucords/quipucords-ui/commit/dcd8c0b4b765f402a0c8d845e364963c8375b853))

##  0.11.1 (2022-09-22)

### Bug Fixes
* **build** discovery-174 css font paths ([#170](https://github.com/quipucords/quipucords-ui/pull/170)) ([d616dfb](https://github.com/quipucords/quipucords-ui/commit/d616dfbb30a7ccc71ff822569c58bf443c51eda8))

## 0.11.0 (2022-09-21)

### Features
* **pf4-style** discovery-8 pf4 base css, scss ([#86](https://github.com/quipucords/quipucords-ui/pull/86)) ([e17a5ea](https://github.com/quipucords/quipucords-ui/commit/e17a5eaa13745c91a8c13936074e568716b941d0))
* **modal** discovery-148 pf4 modal wrapper ([#110](https://github.com/quipucords/quipucords-ui/pull/110)) ([8bc5c28](https://github.com/quipucords/quipucords-ui/commit/8bc5c282cebf114db01ce7fa62d128cd164e3ca5))
* **wizard** discovery-153 pf4 wizard wrapper ([#124](https://github.com/quipucords/quipucords-ui/pull/124)) ([d9cd662](https://github.com/quipucords/quipucords-ui/commit/d9cd662707f09eccac5b01cb44e8fc4a091f8405))
* **addCredentialType** discovery-152 button selector ([#130](https://github.com/quipucords/quipucords-ui/pull/130)) ([4d9d524](https://github.com/quipucords/quipucords-ui/commit/4d9d524ba2a63b86c9d27cbe80d24ddca93b2f05))
* **table** discovery-154 pf4 table wrapper ([#139](https://github.com/quipucords/quipucords-ui/pull/139)) ([1c0b4c8](https://github.com/quipucords/quipucords-ui/commit/1c0b4c82a3f1faa76e5a2bd36800d43f7f626ddb))
* **useTimeout** discovery-154 setTimeout hook ([#145](https://github.com/quipucords/quipucords-ui/pull/145)) ([2af7126](https://github.com/quipucords/quipucords-ui/commit/2af7126978648a087abc2d25324237235e7e5a85))
* **contextIcon** discovery-154 programmatic icons ([#145](https://github.com/quipucords/quipucords-ui/pull/145)) ([6632ca9](https://github.com/quipucords/quipucords-ui/commit/6632ca9c392efb9b187f6efb962f07dbe777b5b2))
* **textInput,formHelpers** discovery-151 pf4 textInput ([#149](https://github.com/quipucords/quipucords-ui/pull/149)) ([5ecf626](https://github.com/quipucords/quipucords-ui/commit/5ecf626cbec18ffea4a9416dd36dd355f594c5f2))
* **contextIconAction** discovery-154 action icons ([#152](https://github.com/quipucords/quipucords-ui/pull/152)) ([0fe3186](https://github.com/quipucords/quipucords-ui/commit/0fe31860cb1a28154c8b987ec797743f2d57d19e))
* **routerContext** discovery-150 hook context ([#169](https://github.com/quipucords/quipucords-ui/pull/169)) ([aceed19](https://github.com/quipucords/quipucords-ui/commit/aceed191007ea71bae8296a869682365ce220db3))

### Bug Fixes
* **build** allow running review, stage parallel ([#86](https://github.com/quipucords/quipucords-ui/pull/86)) ([98885cc](https://github.com/quipucords/quipucords-ui/commit/98885cc68854cc4d52a0f9a373656d27c434f286))
* **style** discovery-8 css, scss vars for color ([#86](https://github.com/quipucords/quipucords-ui/pull/86)) ([9abe42a](https://github.com/quipucords/quipucords-ui/commit/9abe42a465696bb5d0198dfc32b8c65e950072db))
* **build** discovery-174 adjust templates css ([#157](https://github.com/quipucords/quipucords-ui/pull/157)) ([78b4aa8](https://github.com/quipucords/quipucords-ui/commit/78b4aa801a59c1e6010f700bcea3be47306ba750))
* **testing** use i18n unit, remove integration check ([#87](https://github.com/quipucords/quipucords-ui/pull/87)) ([a0797c6](https://github.com/quipucords/quipucords-ui/commit/a0797c6399df25708cb45cf7cbda45103b172818))
* **helpers** discovery-8 consistent brand, getCurrentDate ([#87](https://github.com/quipucords/quipucords-ui/pull/87)) ([57d5f80](https://github.com/quipucords/quipucords-ui/commit/57d5f8063b02ad2128586bfe6497d25c9ab571ae))
* **pf4-style** expose scss variables ([#110](https://github.com/quipucords/quipucords-ui/pull/110)) ([a62c2be](https://github.com/quipucords/quipucords-ui/commit/a62c2be7eab3ad77c29f4dd4ca5e754739b412d0))
* **confirmationModal** expand behavior, allow children ([#113](https://github.com/quipucords/quipucords-ui/pull/113)) ([47975db](https://github.com/quipucords/quipucords-ui/commit/47975db51a869be3e44cdf23e4e438dfaf860345))
* **testing** expand toastNotificationsList snapshots ([#115](https://github.com/quipucords/quipucords-ui/pull/115)) ([fdb48fb](https://github.com/quipucords/quipucords-ui/commit/fdb48fbb1bc7674512d0794d5cda2f344a66c3b3))
* **i18n** discovery-8 partial context into keys ([#124](https://github.com/quipucords/quipucords-ui/pull/124)) ([d241b43](https://github.com/quipucords/quipucords-ui/commit/d241b43c1e7676c2e72ec359d6115808c97d8056))
* **table** discovery-154 key generation ([#140](https://github.com/quipucords/quipucords-ui/pull/140)) ([b917eb0](https://github.com/quipucords/quipucords-ui/commit/b917eb01e827d4b36919c5d95ef3e9609deba8c7))
* **dropdownSelect** discovery-152 props, placeholder ([#145](https://github.com/quipucords/quipucords-ui/pull/145)) ([4f7c6d9](https://github.com/quipucords/quipucords-ui/commit/4f7c6d91ca0e82864c9657e661732c7b08899039))
* **tooltip** discovery-148 hover content wrapper ([#145](https://github.com/quipucords/quipucords-ui/pull/145)) ([95371e5](https://github.com/quipucords/quipucords-ui/commit/95371e53c910653e0bae4d77cd3d468e2a7c748b))
* **table** discovery-154 pass data, keys, styling ([#145](https://github.com/quipucords/quipucords-ui/pull/145)) ([be6a8fd](https://github.com/quipucords/quipucords-ui/commit/be6a8fdd86e22e132f452b061e426b30824a53a5))
* **helpers** discovery-154 global poll interval ([#145](https://github.com/quipucords/quipucords-ui/pull/145)) ([afaa610](https://github.com/quipucords/quipucords-ui/commit/afaa6104b4025ac62011673ee6cfb38b76f78dbb))
* **testing** mock react-redux ([#145](https://github.com/quipucords/quipucords-ui/pull/145)) ([dba7598](https://github.com/quipucords/quipucords-ui/commit/dba7598bd14ef42e97f0d13473137230938d5a8e))
* **dropdownSelect** discovery-151 undefined options ([#149](https://github.com/quipucords/quipucords-ui/pull/149)) ([77052a5](https://github.com/quipucords/quipucords-ui/commit/77052a574defd9ad7d62effa8a15fbef6886e257))
* **scansTableCells,context** discovery-154 actions ([#152](https://github.com/quipucords/quipucords-ui/pull/152)) ([5334351](https://github.com/quipucords/quipucords-ui/commit/53343513df1b90f01325c400e83f91fb723055b9))
* **poll,scanDownload** propTypes, node instead of string ([#154](https://github.com/quipucords/quipucords-ui/pull/154)) ([ad5bd48](https://github.com/quipucords/quipucords-ui/commit/ad5bd486e85ab828683e7764f6df19b9004d1e29))
* **tableHelpers** discovery-154 expand width percentages ([#160](https://github.com/quipucords/quipucords-ui/pull/160)) ([e8fc2d8](https://github.com/quipucords/quipucords-ui/commit/e8fc2d8b286ad255e535a8876a9928c75fa74848))
* **sourcesContext** discovery-154 delete source ([#163](https://github.com/quipucords/quipucords-ui/pull/163)) ([5039b2d](https://github.com/quipucords/quipucords-ui/commit/5039b2d9b1ba4a8424a59bf2fc7863da182267f6))
* **credentials,scans,sources** discovery-154 apiTypes ([#163](https://github.com/quipucords/quipucords-ui/pull/163)) ([68df0b7](https://github.com/quipucords/quipucords-ui/commit/68df0b76626b9123377fcbe164bccdf23153c55f))
* **sources** discovery-154 scans button ([#166](https://github.com/quipucords/quipucords-ui/pull/166)) ([cc7da38](https://github.com/quipucords/quipucords-ui/commit/cc7da38e873100d90b15ec0178f140337efdb29e))
* **toastNotificationsList** discovery-148 pf4 alertVariant ([#167](https://github.com/quipucords/quipucords-ui/pull/167)) ([d37cf83](https://github.com/quipucords/quipucords-ui/commit/d37cf837e2380338f105faec367d4920540d2fbf))
* **scansEmptyState** discovery-154 detect sources ([#169](https://github.com/quipucords/quipucords-ui/pull/169)) ([9b98de6](https://github.com/quipucords/quipucords-ui/commit/9b98de69c31be9c9cf7d52ff4121b7295e4c9aa7))

### Code Refactoring
* **aboutModal** discovery-148 pf4 conversion ([#87](https://github.com/quipucords/quipucords-ui/pull/87)) ([7caa845](https://github.com/quipucords/quipucords-ui/commit/7caa8451ddee5075873fab466974fc46784d5200))
* **modal** discovery-148 pf4 modal wrapper ([#88](https://github.com/quipucords/quipucords-ui/pull/88)) ([b843c7e](https://github.com/quipucords/quipucords-ui/commit/b843c7e6fbd0a8d027655a29c37e3f7eca62b36f))
* **createCredentialDialog** discovery-148 pf4 alert ([#108](https://github.com/quipucords/quipucords-ui/pull/108)) ([1aa7482](https://github.com/quipucords/quipucords-ui/commit/1aa7482789eabe4714aedfcca897f004ae7d1ac6))
* **authentication** discovery-148 pf4 alert, locale ([#112](https://github.com/quipucords/quipucords-ui/pull/112)) ([2cd5ae2](https://github.com/quipucords/quipucords-ui/commit/2cd5ae29edcb599398a67582dccd1c28e0ee5d5f))
* **authentication** discovery-148 replace empty-state ([#113](https://github.com/quipucords/quipucords-ui/pull/113)) ([ce28975](https://github.com/quipucords/quipucords-ui/commit/ce2897561367c5ef1489c0bf5362f20e2c64a6cb))
* **credentials** discovery-148 pf4 empty-state ([#116](https://github.com/quipucords/quipucords-ui/pull/116)) ([e2a17f2](https://github.com/quipucords/quipucords-ui/commit/e2a17f2a8f1263fd4e63b1ae62f5c8e27ad08996))
* **refreshTimeButton** discovery-149 pf4 button, icon ([#114](https://github.com/quipucords/quipucords-ui/pull/114)) ([911b408](https://github.com/quipucords/quipucords-ui/commit/911b408ea8b4fb128b4f91176df056424f80c710))
* **scans** discovery-148 pf4 empty-state ([#117](https://github.com/quipucords/quipucords-ui/pull/117)) ([10883ca](https://github.com/quipucords/quipucords-ui/commit/10883ca816279039ac826173da17f04fc836881b))
* **toastNotificationsList** discovery-148, pf4 alert ([#115](https://github.com/quipucords/quipucords-ui/pull/115)) ([64bd7e4](https://github.com/quipucords/quipucords-ui/commit/64bd7e401ff76608640c0df553cde7bb2927dc8e))
* **sources** discovery-148 pf4 empty-state ([#120](https://github.com/quipucords/quipucords-ui/pull/120)) ([113da41](https://github.com/quipucords/quipucords-ui/commit/113da41a2b791dc3597ee47105eeb0309ff68583))
* **creds,sources,scans** discovery-149 emptyState grid ([#121](https://github.com/quipucords/quipucords-ui/pull/121)) ([2cc6f5d](https://github.com/quipucords/quipucords-ui/commit/2cc6f5d33da04475d51005b30d98d00cb76f9c45))
* **addSourceWizard** discovery-153, pf4 wizard ([#124](https://github.com/quipucords/quipucords-ui/pull/124)) ([0aed24d](https://github.com/quipucords/quipucords-ui/commit/0aed24dd273f1e200c6ecec870d0df4db71fae02))
* **scanHostList** discovery-148, pf4 empty-state ([#125](https://github.com/quipucords/quipucords-ui/pull/125)) ([832761b](https://github.com/quipucords/quipucords-ui/commit/832761b9c7678cc4255138b2f62a9a97d85f213c))
* **creds,sources,scans** discovery-149 pf4 grid, list ([#126](https://github.com/quipucords/quipucords-ui/pull/126)) ([2a8789b](https://github.com/quipucords/quipucords-ui/commit/2a8789b3cba4c055d6e7058ca563a397087cd7ef))
* **dropdownSelect** discovery-152 pf4 select, dropdown ([#127](https://github.com/quipucords/quipucords-ui/pull/127)) ([9ca4c48](https://github.com/quipucords/quipucords-ui/commit/9ca4c489513173165f819be82376f8e8574eb834))
* **dropdownSelect** discovery-152 pf4 dropdown ([#130](https://github.com/quipucords/quipucords-ui/pull/130)) ([3745d5e](https://github.com/quipucords/quipucords-ui/commit/3745d5e0a463804c2c75303bccc9d3cffaeb4150))
* **credentials** discovery-152, pf4 dropdown ([#130](https://github.com/quipucords/quipucords-ui/pull/130)) ([0416840](https://github.com/quipucords/quipucords-ui/commit/0416840887815fa82cc9a5c7182d24e66345390f))
* **tooltip** discovery-148 pf4 tooltip, popover ([#132](https://github.com/quipucords/quipucords-ui/pull/132)) ([f8a0544](https://github.com/quipucords/quipucords-ui/commit/f8a05449d6c118b560788187e4fedbcc5c0444de))
* **pagination** discovery 154 pf4 pagination ([#129](https://github.com/quipucords/quipucords-ui/pull/129)) ([292d158](https://github.com/quipucords/quipucords-ui/commit/292d1580644667a5686cb6e5c0f1e0d4a2f8cbc1))
* **buttons** discovery-149 sources pf4 buttons ([#136](https://github.com/quipucords/quipucords-ui/pull/136)) ([57ca4f5](https://github.com/quipucords/quipucords-ui/commit/57ca4f51500e2e287518f92c79331caff2bb4793))
* **buttons** discovery-149 scans,credentials pf buttons ([#142](https://github.com/quipucords/quipucords-ui/pull/142)) ([637464c](https://github.com/quipucords/quipucords-ui/commit/637464c018a716f1a5bb2976763b7d415ae59add))
* **createScanDialog** discovery-148, pf4 alert ([#144](https://github.com/quipucords/quipucords-ui/pull/144)) ([c1e2ace](https://github.com/quipucords/quipucords-ui/commit/c1e2aceac2ecfd3bfc3e1694cb72264580f4033a))
* **sources** discovery-154, pf4 table ([#141](https://github.com/quipucords/quipucords-ui/pull/141)) ([1e8ccb7](https://github.com/quipucords/quipucords-ui/commit/1e8ccb7f8b4b9631128fa761baf9a94efa52696f))
* **scans** discovery-154, pf4 table ([#152](https://github.com/quipucords/quipucords-ui/pull/152)) ([593ffb3](https://github.com/quipucords/quipucords-ui/commit/593ffb308a48c2691a60d70038231cb036b08b53))
* **credentials** discovery-154, pf4 table ([#160](https://github.com/quipucords/quipucords-ui/pull/160)) ([8a716ee](https://github.com/quipucords/quipucords-ui/commit/8a716eee76144a8dfc85ac916901f8e0b626bf19))
* **helpers,redux** discovery-154, clean up ([#163](https://github.com/quipucords/quipucords-ui/pull/163)) ([967c5be](https://github.com/quipucords/quipucords-ui/commit/967c5bebb61804429f43978d685f9ca57198c5a8))
* **router** discovery-150 router npm update ([#164](https://github.com/quipucords/quipucords-ui/pull/164)) ([18ad1cf](https://github.com/quipucords/quipucords-ui/commit/18ad1cf3d28b0f8cb24c86f528de4789c2b48287))
* **button,icon,spinner** discovery-149 pf4 replacements ([#165](https://github.com/quipucords/quipucords-ui/pull/165)) ([21846cc](https://github.com/quipucords/quipucords-ui/commit/21846cc4454b0fa2d1cf0421451dc6a3ec9784ac))

## 0.10.1 (2022-08-17)

### Bug Fixes

* **build:** discovery-174 templates css ([#143](https://github.com/quipucords/quipucords-ui/issues/143)) ([ea98268](https://github.com/quipucords/quipucords-ui/commit/ea982687ad3347cff942782ffc947dd2172ccc1c))

## 0.10.0 (2022-08-10)

### Bug Fixes

* **build:** base dep package updates ([#80](https://github.com/quipucords/quipucords-ui/issues/80)) ([e8fb47b](https://github.com/quipucords/quipucords-ui/commit/e8fb47be384272fd18bfbaa426b0232bed1a2d40))
* **build:** discovery-8 allow repo locale files ([#85](https://github.com/quipucords/quipucords-ui/issues/85)) ([a5a1a0d](https://github.com/quipucords/quipucords-ui/commit/a5a1a0dd3e5e2881f3beb514bf3c28449f7db42c))
* **build:** npm update, redux middleware ([#82](https://github.com/quipucords/quipucords-ui/issues/82)) ([d0a1aba](https://github.com/quipucords/quipucords-ui/commit/d0a1aba0c498067531ca335983897b622b31aa5f))
* **build:** npm updates ([#80](https://github.com/quipucords/quipucords-ui/issues/80)) ([b1ec470](https://github.com/quipucords/quipucords-ui/commit/b1ec470eb25ab27169d7eec94b47629f4177b227))
* **build:** npm updates ([#83](https://github.com/quipucords/quipucords-ui/issues/83)) ([29afd8f](https://github.com/quipucords/quipucords-ui/commit/29afd8f2ed4804a3a385c5c2938a2406ebb3b790))
* **build:** update react ([#80](https://github.com/quipucords/quipucords-ui/issues/80)) ([1fdb58c](https://github.com/quipucords/quipucords-ui/commit/1fdb58c108b2adb1b72a9204d5946f2572c2c639))
* **i18n:** component loading ([#80](https://github.com/quipucords/quipucords-ui/issues/80)) ([e904e0d](https://github.com/quipucords/quipucords-ui/commit/e904e0d663836a0dee40f6960cc4d81b3c99ddcc))

### Code Refactoring

* **redux:** discovery-8 middleware, hooks, restructure ([#82](https://github.com/quipucords/quipucords-ui/issues/82)) ([acabcf8](https://github.com/quipucords/quipucords-ui/commit/acabcf827f17d5755a7bc303ca49829fea5158bb))
* **services:** discovery-8 minor config restructure ([#82](https://github.com/quipucords/quipucords-ui/issues/82)) ([90a4dfd](https://github.com/quipucords/quipucords-ui/commit/90a4dfdf9a536484b793cfe4ee4926652d70f506))

## 0.9.3 (2020-05-14)

### Bug Fixes

* **addSourceWizardStepTwo:** issues/77 add source regex ([#78](https://github.com/quipucords/quipucords-ui/issues/78)) ([3d1aeea](https://github.com/quipucords/quipucords-ui/commit/3d1aeea))
* **build:** file lint updates ([2919e90](https://github.com/quipucords/quipucords-ui/commit/2919e90))
* **build:** npm updates and linting ([dc5cbdf](https://github.com/quipucords/quipucords-ui/commit/dc5cbdf))

## 0.9.2 (2019-12-12)

### Bug Fixes

* **build:** issues/73 correct Django token reference ([#74](https://github.com/quipucords/quipucords-ui/issues/74)) ([06966d4](https://github.com/quipucords/quipucords-ui/commit/06966d4))

## 0.9.1 (2019-08-20)

### Bug Fixes

* **build:** issues/53 brand, contribution guide ([#65](https://github.com/quipucords/quipucords-ui/issues/65)) ([10d4a37](https://github.com/quipucords/quipucords-ui/commit/10d4a37))
* **build:** issues/60 jenkins file for branded UI ([#67](https://github.com/quipucords/quipucords-ui/issues/67)) ([14b6d95](https://github.com/quipucords/quipucords-ui/commit/14b6d95))
* **build:** issues/63 Quipudocs package ([#66](https://github.com/quipucords/quipucords-ui/issues/66)) ([354a5bf](https://github.com/quipucords/quipucords-ui/commit/354a5bf))
* **quipudocs, pageLayout:** issues/68 disable install guide ([#69](https://github.com/quipucords/quipucords-ui/issues/69)) ([2cdf23f](https://github.com/quipucords/quipucords-ui/commit/2cdf23f))

### Features

* **docs:** issues/38 integrate documentation ([#62](https://github.com/quipucords/quipucords-ui/issues/62)) ([d21d47f](https://github.com/quipucords/quipucords-ui/commit/d21d47f))

## 0.9.0 (2019-06-13)

### Bug Fixes

* **addSourceWizard:** copy updates ([#26](https://github.com/quipucords/quipucords-ui/issues/26)) ([2107682](https://github.com/quipucords/quipucords-ui/commit/2107682))
* **app, auth, pageLayout, router:**  issues/18 migrate prep pf4 ([#47](https://github.com/quipucords/quipucords-ui/issues/47)) ([98b8da3](https://github.com/quipucords/quipucords-ui/commit/98b8da3))
* **build:** issues/29 version display ([#43](https://github.com/quipucords/quipucords-ui/issues/43)) ([e48a322](https://github.com/quipucords/quipucords-ui/commit/e48a322))
* **build:** issues/50 clean up docker review env ([#55](https://github.com/quipucords/quipucords-ui/issues/55)) ([6bf20ec](https://github.com/quipucords/quipucords-ui/commit/6bf20ec))
* **confirmation, formState, app, about, masthead, redux:** issues/1  ([#10](https://github.com/quipucords/quipucords-ui/issues/10)) ([496df34](https://github.com/quipucords/quipucords-ui/commit/496df34))
* **createScanDialog:** issues/28 concurrency default ([#32](https://github.com/quipucords/quipucords-ui/issues/32)) ([5d111e4](https://github.com/quipucords/quipucords-ui/commit/5d111e4))
* **createScanDialog, helpers:** issues/34 deep scan copy ([#35](https://github.com/quipucords/quipucords-ui/issues/35)) ([98eab26](https://github.com/quipucords/quipucords-ui/commit/98eab26))
* **credentialListItem, createCredentialDialog:** issues/36 copy ([#37](https://github.com/quipucords/quipucords-ui/issues/37)) ([c4500c0](https://github.com/quipucords/quipucords-ui/commit/c4500c0))
* **lodash, redux, tooltip:** issues/1 support updates ([#9](https://github.com/quipucords/quipucords-ui/issues/9)) ([7c2328e](https://github.com/quipucords/quipucords-ui/commit/7c2328e))
* **login, logged_out:** issues/40 copy ([#42](https://github.com/quipucords/quipucords-ui/issues/42)) ([0a5b08b](https://github.com/quipucords/quipucords-ui/commit/0a5b08b))
* **reportsService:** issues/52 name report package download ([#54](https://github.com/quipucords/quipucords-ui/issues/54)) ([d79bdd5](https://github.com/quipucords/quipucords-ui/commit/d79bdd5))
* **sourceListItem:** update sources list on delete ([#33](https://github.com/quipucords/quipucords-ui/issues/33)) ([ae2fc83](https://github.com/quipucords/quipucords-ui/commit/ae2fc83))
* **sources view:** issues/39 network address styling ([#41](https://github.com/quipucords/quipucords-ui/issues/41)) ([6700a9b](https://github.com/quipucords/quipucords-ui/commit/6700a9b))

### Features

* **build:** issues/7 template output tests ([#44](https://github.com/quipucords/quipucords-ui/issues/44)) ([2104ba4](https://github.com/quipucords/quipucords-ui/commit/2104ba4))
* **build, aboutModal, helpers:** issues/29 version display ([#31](https://github.com/quipucords/quipucords-ui/issues/31)) ([7af215a](https://github.com/quipucords/quipucords-ui/commit/7af215a))
* **createScanDialog:** issues/1 scan creation options ([#25](https://github.com/quipucords/quipucords-ui/issues/25)) ([c9d5f21](https://github.com/quipucords/quipucords-ui/commit/c9d5f21))
* **i18n:** issues/38 i18n integration, link to quipudocs ([#51](https://github.com/quipucords/quipucords-ui/issues/51)) ([89ef65c](https://github.com/quipucords/quipucords-ui/commit/89ef65c))
* **poll, reports:** issues/46 download report package ([#48](https://github.com/quipucords/quipucords-ui/issues/48)) ([8a3c560](https://github.com/quipucords/quipucords-ui/commit/8a3c560))
* **styling:** issues/6 refresh for brand logos, styling ([#27](https://github.com/quipucords/quipucords-ui/issues/27)) ([e2bb2fc](https://github.com/quipucords/quipucords-ui/commit/e2bb2fc))
