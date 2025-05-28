# Changelog

All notable changes to this project will be documented in this file.

## [1.14.2](https://github.com/quipucords/quipucords-ui/compare/142abbe6fd530a14295101c19a3c9db56a986755...68a4c57d1cc02b347585e1dd4d809309e325bbf4) (2025-05-28)


### Continuous Integrations
* **konflux** adjust pipeline to support discovery release workflow  ([a13a43e](https://github.com/quipucords/quipucords-ui/commit/a13a43eea8b06a33885b08e1d7fed5577c6b1656))

### Builds
*  make update-lockfiles  ([68a4c57](https://github.com/quipucords/quipucords-ui/commit/68a4c57d1cc02b347585e1dd4d809309e325bbf4))
*  Missing x.y release container image ([#631](https://github.com/quipucords/quipucords-ui/pull/631)) ([8ce67c5](https://github.com/quipucords/quipucords-ui/commit/8ce67c5ebbb9761655f4aee63ef7114d4bc684b7))

## [1.14.1](https://github.com/quipucords/quipucords-ui/compare/b2f539c0ac02f7fc701c60bec18e2c60a76904c6...dafb6479475ba8c9b4a5f8a7c27ee3725ee2250e) (2025-05-07)


### Continuous Integrations
* **konflux** fail if the labels are not in the required format  ([1730969](https://github.com/quipucords/quipucords-ui/commit/17309694c2d0ce25db7f656efba3961e4ca05d69))

### Builds
*  make update-lockfiles  ([dafb647](https://github.com/quipucords/quipucords-ui/commit/dafb6479475ba8c9b4a5f8a7c27ee3725ee2250e))
*  stop pushing `main` container tags (but continue pushing `latest`)  ([9666e71](https://github.com/quipucords/quipucords-ui/commit/9666e71a9ec184b9b954c1491560eb1f6ca7e8cf))

## [1.14.0](https://github.com/quipucords/quipucords-ui/compare/d1b6a7af69f0861e73bbc024d48d79f349d33f27...268a2c6f0f01e87a2fdc05d02236ba22384549f0) (2025-04-29)


### Tests
*  enable timestamps in logs for internal CI ([#612](https://github.com/quipucords/quipucords-ui/pull/612)) ([bab2dfa](https://github.com/quipucords/quipucords-ui/commit/bab2dfa313307f786279f859dd3f5aeb30f9226f))

### Performance Improvements
* **lock-baseimages** speed up make lock-baseimages  ([a6eaefd](https://github.com/quipucords/quipucords-ui/commit/a6eaefd195c86947124a12c28c28b830dd020c70))

### Features
* **about** dsc-857 show CPU architecture  ([e437cc9](https://github.com/quipucords/quipucords-ui/commit/e437cc96f97106dd0c389ed4b72c52c5f54ff32a))

### Documentation
*  update CSpell custom dictionary  ([61bbe27](https://github.com/quipucords/quipucords-ui/commit/61bbe27c618f3f2e448410cf4e76e52126f08621))
*  macOS devs need to upgrade or install make, sed, and skopeo  ([2254f32](https://github.com/quipucords/quipucords-ui/commit/2254f32ac327644edfad162e2431c00fd07afef6))

### Continuous Integrations
* **konflux** build pipeline service account migration  ([f254b44](https://github.com/quipucords/quipucords-ui/commit/f254b44e27eada85812631c822333b9263b00db0))
* **konflux** dynamically set version labels  ([be5c017](https://github.com/quipucords/quipucords-ui/commit/be5c017518678ce0628379604a412be17611c785))
* **konflux** add sast-unicode-check task  ([ce3d2ce](https://github.com/quipucords/quipucords-ui/commit/ce3d2ce8078839f8588379ad1e28fc29927ab97c))

### Chores
* **deps** update quay.io/konflux-ci/yq latest docker digest to 2d22666  ([5c4037d](https://github.com/quipucords/quipucords-ui/commit/5c4037dc1c2e3f85123634dc0674c92bb0d40021))
* **deps** update konflux references  ([967f89b](https://github.com/quipucords/quipucords-ui/commit/967f89baeb7b0cb5ab39ebaa61c466ca6b63c0f2))
* **deps** update konflux references  ([ea3e1e0](https://github.com/quipucords/quipucords-ui/commit/ea3e1e00abb2253d569c94fd1185600dc1a8cf58))
* **deps** update quay.io/konflux-ci/yq latest docker digest to 06e98f3  ([aeaa54b](https://github.com/quipucords/quipucords-ui/commit/aeaa54bbd42e9151d270c682df82ce27e8318b8e))
*  add disclaimer about versioning  ([636b3d0](https://github.com/quipucords/quipucords-ui/commit/636b3d00cf48f6fa0aa0e1892fd246a4fabc9e0f))
* **deps** update konflux references  ([30ca03b](https://github.com/quipucords/quipucords-ui/commit/30ca03b3f9e847d345448d4560640fb5ba4a43c1))
* **deps** update registry.access.redhat.com/ubi9/nginx-124 docker digest to 13f67b0  ([fc07c48](https://github.com/quipucords/quipucords-ui/commit/fc07c488d14f7ec85fb6c03720bcc671c4744b83))
* **deps** update registry.access.redhat.com/ubi9/nodejs-22 docker digest to 651d11f  ([46363af](https://github.com/quipucords/quipucords-ui/commit/46363afdafde7d2135ebd264713f37ef7986587f))
* **deps** update konflux references  ([be2d56f](https://github.com/quipucords/quipucords-ui/commit/be2d56fe2f1054bceb1282d35332665af458a3cb))
* **deps** update registry.access.redhat.com/ubi9/nginx-124 docker digest to 5982c87  ([87e1130](https://github.com/quipucords/quipucords-ui/commit/87e1130b5d44f6fe05f9860e0f93f026c8ad0fb8))

### Builds
*  make update-lockfiles  ([268a2c6](https://github.com/quipucords/quipucords-ui/commit/268a2c6f0f01e87a2fdc05d02236ba22384549f0))
*  make update-lockfiles  ([ce0f10f](https://github.com/quipucords/quipucords-ui/commit/ce0f10fb5fa19abe47eed29a38202d74b90cc158))
*  add update-konflux-pipeline and update-lockfiles targets  ([1cc34b9](https://github.com/quipucords/quipucords-ui/commit/1cc34b963e7552a5c696f0cb5c2e80c5a066d6c5))
*  Use buildah for multi arch manifests ([#610](https://github.com/quipucords/quipucords-ui/pull/610)) ([6d58816](https://github.com/quipucords/quipucords-ui/commit/6d58816fe33747037766a7c077c3c3ec7871b904))
*  make lock-baseimages  ([b8a9bd5](https://github.com/quipucords/quipucords-ui/commit/b8a9bd5fb1d0c0173cd8d7271572d9b66159a715))
*  add make target for locking base images  ([56b0c4e](https://github.com/quipucords/quipucords-ui/commit/56b0c4ed808bfbc9208b48943c266b1871346a99))

### Bug Fixes
* **scan** dsc-859 Display only one toast when scan can't be created  ([72c52e7](https://github.com/quipucords/quipucords-ui/commit/72c52e72d3514ed7bd62eb6fa54f996444e26323))
* **scans** dsc-891 Use "scan" in scan removal dialog  ([b7b11ad](https://github.com/quipucords/quipucords-ui/commit/b7b11adec6d2d895ac39772dc3de3f14dd9bf78f))
* **deps** patch vulnerability in axios  ([30f952d](https://github.com/quipucords/quipucords-ui/commit/30f952d31270002df743da57b201e2e61cb2f722))

## [1.13.0](https://github.com/quipucords/quipucords-ui/compare/4e0e966249d68cb3b1b4a910e4a332af6b751834...8db9cd2a92386b1b2448de343de00a3f64f1cc10) (2025-02-26)


### Documentation
*  remove unnecessary GitHub templates  ([14e216c](https://github.com/quipucords/quipucords-ui/commit/14e216c6745ed427b37059072043acdf1357d4c8))

### Continuous Integrations
* **github-actions** disable unecessary step publishing upstream assets  ([0b8c1b1](https://github.com/quipucords/quipucords-ui/commit/0b8c1b10aaef89088e25e25c4d9290b18ee93481))
* **konflux** disable sast-coverity-check  ([c24ab9e](https://github.com/quipucords/quipucords-ui/commit/c24ab9e49c1757d972c1773576c3f89322955f2a))
*  drop commit lint action  ([fc00c43](https://github.com/quipucords/quipucords-ui/commit/fc00c43e0d588ddbb4df745dd92593e097ccd48a))
* **konflux** make snyk results available on ui  ([d5d28b8](https://github.com/quipucords/quipucords-ui/commit/d5d28b862644a7364be127f06a554d59d4673a46))

### Code Refactoring
*  creating a Source should not create a connect-type ScanJob  ([febb083](https://github.com/quipucords/quipucords-ui/commit/febb083c07eed42b26e9a05a6ae9dfc85422aab7))

### Chores
* **deps** update konflux references  ([5f66368](https://github.com/quipucords/quipucords-ui/commit/5f663686e70a7d0b44bbd91c84031277a88f61d7))
* **deps** update registry.access.redhat.com/ubi9/nginx-124 docker digest to e73b92e  ([19708c2](https://github.com/quipucords/quipucords-ui/commit/19708c265920ff079fbef563ff38898ff0e71c43))
* **deps** update registry.access.redhat.com/ubi9/nodejs-18 docker digest to a2cc112  ([b558539](https://github.com/quipucords/quipucords-ui/commit/b55853938f50ccfec265e8d537cfb43ad7db4673))
* **deps** update konflux references  ([49a2d16](https://github.com/quipucords/quipucords-ui/commit/49a2d166b18f6abec117d62e57dce9dc613d2c65))
* **deps** update registry.access.redhat.com/ubi9/nodejs-18 docker digest to 07c63a0  ([f6a4532](https://github.com/quipucords/quipucords-ui/commit/f6a45326af83acf6fb3a3a63fd6ac7a8fae4ba01))
* **deps** update registry.access.redhat.com/ubi9/nginx-124 docker digest to 069d130  ([cc21f71](https://github.com/quipucords/quipucords-ui/commit/cc21f71898688d43b3a131b1aa54ed453fcab8ca))
* **deps** update registry.access.redhat.com/ubi9/nginx-124 docker digest to c6cb099  ([608d58f](https://github.com/quipucords/quipucords-ui/commit/608d58f5298315230f3a419567b5b1367bec6251))

### Builds
*  bump node version to 22  ([8db9cd2](https://github.com/quipucords/quipucords-ui/commit/8db9cd2a92386b1b2448de343de00a3f64f1cc10))

### Bug Fixes
*  undo change made by mistake  ([df9c133](https://github.com/quipucords/quipucords-ui/commit/df9c133247f5852d37d98580a8557a7f7aeb3931))

## [1.12.0](https://github.com/quipucords/quipucords-ui/compare/73c90b235eaa716014d95af370f963dc397e11b4...eb6d142887f980ac191bc3be9b62a5b200a3845c) (2025-02-04)


### Tests
*  add ouiaId to make reports downloading easier  ([d1e533a](https://github.com/quipucords/quipucords-ui/commit/d1e533acf6b1575824f9d351c8b663c0d85b7fbb))

### Continuous Integrations
* **konflux** upgrade arm build to a instance with more memory  ([eb6d142](https://github.com/quipucords/quipucords-ui/commit/eb6d142887f980ac191bc3be9b62a5b200a3845c))
* **konflux** multi-arch support  ([3c1936a](https://github.com/quipucords/quipucords-ui/commit/3c1936a1e37de9c39b9555538a646eac356b7b70))
* **konflux** add missing versions to tekton tasks  ([3f5b000](https://github.com/quipucords/quipucords-ui/commit/3f5b0001a0e2fc013bbb713a6c42861649c688a8))
* **konflux** update tekton tasks  ([53238d6](https://github.com/quipucords/quipucords-ui/commit/53238d67f0f1805aaddc16b763b4ef0ef8cca6c1))
* **konflux** make labels customizable  ([8e94966](https://github.com/quipucords/quipucords-ui/commit/8e94966226309f4a00c4e86cef27bbe7f6f7a47f))
* **konflux** build source image  ([5d82175](https://github.com/quipucords/quipucords-ui/commit/5d821751a004bbcc4aaf5bbfc863c5c8d62b44f2))
* **konflux** setup prefetch-dependencies step  ([36508d7](https://github.com/quipucords/quipucords-ui/commit/36508d7d0c6776c36c2de72746d0afe5bf2956b3))
* **konflux** disable update of dnf packages  ([61883bb](https://github.com/quipucords/quipucords-ui/commit/61883bb852cf5079483d4efae7d2e87728e5b322))
* **konflux** enable hermetic build  ([bf53cef](https://github.com/quipucords/quipucords-ui/commit/bf53cefc76e01a6744eb7b03acb271dcdc9501c7))
* **konflux** use branded version  ([5bdc5c1](https://github.com/quipucords/quipucords-ui/commit/5bdc5c1229eb267a31b856152110dab186e86e7a))
* **konflux** add labels  ([d390733](https://github.com/quipucords/quipucords-ui/commit/d390733fdbfa3f76516923016eda8b09d4902ae1))
* **konflux** add /licenses folder for konflux  ([10ab37f](https://github.com/quipucords/quipucords-ui/commit/10ab37fdcb286692f03baddda01376b4dc4bb0b2))

### Chores
* **deps** update konflux references  ([e5ca59a](https://github.com/quipucords/quipucords-ui/commit/e5ca59a757cb512f39cbce15670f29f2e16c0e90))
* **deps** update konflux references  ([4151525](https://github.com/quipucords/quipucords-ui/commit/41515259c541d694996745667b70f8c2e1ef564b))
* **build** ds-748 use correct container label  ([d270259](https://github.com/quipucords/quipucords-ui/commit/d270259e5671d1f0135551e01eb9691b0f01be28))

### Builds
* **deps** bump path-to-regexp and express  ([f249d2b](https://github.com/quipucords/quipucords-ui/commit/f249d2b11e90dc0c84ed1de7899e23029fe9c7c8))
* **deps** bump axios  ([63aa8d9](https://github.com/quipucords/quipucords-ui/commit/63aa8d9f6ec12d7d9749a7db0ee30bbc8851891d))
* **konflux** lock base image by digest  ([70c033e](https://github.com/quipucords/quipucords-ui/commit/70c033e0e158cf585bc6b251172ceadcb5f77992))
*  add a utility script to make development easier  ([72347e7](https://github.com/quipucords/quipucords-ui/commit/72347e7b7fd9d8c0c0a3fa97f5f0f4dcd224ed0f))
*  onboard to konflux  ([cac26fd](https://github.com/quipucords/quipucords-ui/commit/cac26fddf6b60be8a1184013793aa24770e7b1a8))

## [1.11.0](https://github.com/quipucords/quipucords-ui/compare/ecfb69c27dd0344d75f8192adf72b19e71ef924d...8412af81f71f9afb62f715e7f86b21cb77ae62ee) (2024-12-02)


### Tests
*  ds-767 lower coverage thresholds  ([b9a82b8](https://github.com/quipucords/quipucords-ui/commit/b9a82b80c4e8ca3524fccd4570ab58e64134a5e2))
*  ds-523 introduce Camayoc PR testing  ([db649bb](https://github.com/quipucords/quipucords-ui/commit/db649bb543b4f2d9c81a448927a479b76fa9b1bc))
* **addSourceModal** ds-767 lint, test updates ([#446](https://github.com/quipucords/quipucords-ui/pull/446)) ([cc533bc](https://github.com/quipucords/quipucords-ui/commit/cc533bc1944c017569f1246a207c67a442b2b05c))
* **addSourcesScanModal** ds-767 lint, test updates ([#450](https://github.com/quipucords/quipucords-ui/pull/450)) ([62bbd97](https://github.com/quipucords/quipucords-ui/commit/62bbd975f810477f7529975768a46ccb3d1a9c54))
*  ds-767 ignore views from coverage ([#447](https://github.com/quipucords/quipucords-ui/pull/447)) ([d527630](https://github.com/quipucords/quipucords-ui/commit/d5276303dd9097313687118c3d56244709669509))
* **showSourceConnectionsModal** ds-742 lint, add tests ([#431](https://github.com/quipucords/quipucords-ui/pull/431)) ([87ae466](https://github.com/quipucords/quipucords-ui/commit/87ae466037cdb022d4c109f3efa1589ed422141f))
* **showScansModal** ds-742 lint, simplify test ([#430](https://github.com/quipucords/quipucords-ui/pull/430)) ([3c65718](https://github.com/quipucords/quipucords-ui/commit/3c6571860c9c84eb611fbcfe848a47c4665ff4fc))
* **typeaheadCheckboxes** ds-742 lint, basic test ([#429](https://github.com/quipucords/quipucords-ui/pull/429)) ([f3b2d85](https://github.com/quipucords/quipucords-ui/commit/f3b2d859aba21dbb23d43aa5cfdda41d202c0d46))
* **actionMenu** ds-742 lint, test updates ([#426](https://github.com/quipucords/quipucords-ui/pull/426)) ([55df3b0](https://github.com/quipucords/quipucords-ui/commit/55df3b0508023fc1f990ec9fc2abb14e0a40ca5e))
* **helpers** ds-742 snapshot, update link click error ([#424](https://github.com/quipucords/quipucords-ui/pull/424)) ([302e131](https://github.com/quipucords/quipucords-ui/commit/302e1319a52411b8c198d8881837cf875c49b9d9))
*  ds-742 remove typings, constants from coverage ([#423](https://github.com/quipucords/quipucords-ui/pull/423)) ([481aa9a](https://github.com/quipucords/quipucords-ui/commit/481aa9a1281cf9e93bd5d64ff2d49b84a9c4ab8d))
*  ds-356 adjust mock i18next to output string ([#422](https://github.com/quipucords/quipucords-ui/pull/422)) ([bd111cf](https://github.com/quipucords/quipucords-ui/commit/bd111cf9261ca472bf76909e32f7239f46ed4f3a))
*  ds-680 unit tests to hooks/useScanApi ([#381](https://github.com/quipucords/quipucords-ui/pull/381)) ([4af0050](https://github.com/quipucords/quipucords-ui/commit/4af00502ef3925eb257fdf41610550bc56ec806a))
*  ds-680 unit tests to hooks/useSourceApi  ([cd8abe9](https://github.com/quipucords/quipucords-ui/commit/cd8abe9674a1fca29f6c06e868c31618745d41f0))
*  ds-680 unit tests to hooks/useCredentialApi ([#379](https://github.com/quipucords/quipucords-ui/pull/379)) ([92f4b7d](https://github.com/quipucords/quipucords-ui/commit/92f4b7dfcf9348ea1d7e148434fa8ccb3ed76025))
*  ds-680 add unit tests to hooks/useAlerts ([#377](https://github.com/quipucords/quipucords-ui/pull/377)) ([ce068c2](https://github.com/quipucords/quipucords-ui/commit/ce068c2d9b8ec5785715d544f18fa009ad75941f))
*  ds-662 add unit tests to helpers module ([#368](https://github.com/quipucords/quipucords-ui/pull/368)) ([b27b830](https://github.com/quipucords/quipucords-ui/commit/b27b830a1b9acdba7ac1857e0288942888c649d1))

### Styles
* **credentials** ds-438 fix inconsistent style ([#456](https://github.com/quipucords/quipucords-ui/pull/456)) ([d0a7b69](https://github.com/quipucords/quipucords-ui/commit/d0a7b69cdcb07eba7df2d3137b6fef48e614a0ff))
* **cred,source,scan** ds-438  popup style fix ([#454](https://github.com/quipucords/quipucords-ui/pull/454)) ([1db100d](https://github.com/quipucords/quipucords-ui/commit/1db100d7eccf252cb6cc41a40d2d8210c00d3e46))
*  ds-647 file, linting consistency ([#390](https://github.com/quipucords/quipucords-ui/pull/390)) ([e340035](https://github.com/quipucords/quipucords-ui/commit/e340035697161ed148e05a42be21ecaca3a094b0))
*  file, linting consistency ([#390](https://github.com/quipucords/quipucords-ui/pull/390)) ([64ac3c4](https://github.com/quipucords/quipucords-ui/commit/64ac3c4ba48d5989a7ed5bc795d7790ab59a259c))

### Features
* **credential** ds-438 edit credential ([#507](https://github.com/quipucords/quipucords-ui/pull/507)) ([8412af8](https://github.com/quipucords/quipucords-ui/commit/8412af81f71f9afb62f715e7f86b21cb77ae62ee))
* **ActionMenu<Scan>** ds-437 add download report button ([#513](https://github.com/quipucords/quipucords-ui/pull/513)) ([23546f0](https://github.com/quipucords/quipucords-ui/commit/23546f0af3aeee22016e584ba158cea99e58d541))
* **login** ds-805 Display proper message on 403 response  ([3d49861](https://github.com/quipucords/quipucords-ui/commit/3d498612673e0faa1ef5981091038b2039faade9))
* **errorMessage** ds-809 creds, scans, sources messaging ([#490](https://github.com/quipucords/quipucords-ui/pull/490)) ([154014c](https://github.com/quipucords/quipucords-ui/commit/154014ca1b421e37d28f0a0240c9298a5b1a9322))
* **aboutModal** ds-808 display user, status info ([#488](https://github.com/quipucords/quipucords-ui/pull/488)) ([1bc3c89](https://github.com/quipucords/quipucords-ui/commit/1bc3c892155e0f04a0543bc7dc3ca0452f6e3270))
* **scans** ds-437 add close button to modal ([#478](https://github.com/quipucords/quipucords-ui/pull/478)) ([859471a](https://github.com/quipucords/quipucords-ui/commit/859471a2c413375939e6fe06b12c8556d89beee8))
*  ds-356 exclusively serve the current UI  ([9a0211d](https://github.com/quipucords/quipucords-ui/commit/9a0211d6c54ed3368b035a5655ded05bd5790318))
*  ds-504 add credential feature ([#414](https://github.com/quipucords/quipucords-ui/pull/414)) ([ef7cab9](https://github.com/quipucords/quipucords-ui/commit/ef7cab97445af767b151f853fad73f9e26c91aa3))

### Documentation
*  updates for current development strategy, resources ([#521](https://github.com/quipucords/quipucords-ui/pull/521)) ([3825c7c](https://github.com/quipucords/quipucords-ui/commit/3825c7c415ad8eb68d6604c0029e26d416ab0b3f))

### Continuous Integrations
*  ds-647 adjust gh workflow job names ([#396](https://github.com/quipucords/quipucords-ui/pull/396)) ([f3a4ac0](https://github.com/quipucords/quipucords-ui/commit/f3a4ac0cf193f9749e467f9a4514ffbafbcf1cbf))
*  ds-647 favor jest coverage report, remove codecov ([#391](https://github.com/quipucords/quipucords-ui/pull/391)) ([e9667f2](https://github.com/quipucords/quipucords-ui/commit/e9667f20b60fb74ecb1c342ba24b973de93c5bdf))
*  ds-647 reorder lint, build, test actions ([#391](https://github.com/quipucords/quipucords-ui/pull/391)) ([b81fb52](https://github.com/quipucords/quipucords-ui/commit/b81fb52ff627da895eef275b8b8ae943382e2055))

### Code Refactoring
*  ds-438 display items alphabetical order ([#486](https://github.com/quipucords/quipucords-ui/pull/486)) ([baf4808](https://github.com/quipucords/quipucords-ui/commit/baf48089426329a045c3f072868901a58dcddedb))
* **addSourceModal** align form state with credential form ([#460](https://github.com/quipucords/quipucords-ui/pull/460)) ([dcab39d](https://github.com/quipucords/quipucords-ui/commit/dcab39d99ba9e463e19da40dea6bc6f039a4ef56))
* **testing** DISCOVERY-523 Add attributes to aid UI tests ([#463](https://github.com/quipucords/quipucords-ui/pull/463)) ([c1a548a](https://github.com/quipucords/quipucords-ui/commit/c1a548a325465a8b63ce880bb558da802ccc8888))
*  ds-775 dotenv params for branding display ([#459](https://github.com/quipucords/quipucords-ui/pull/459)) ([b00c770](https://github.com/quipucords/quipucords-ui/commit/b00c77068cf31d74e9dd67172217bd553c514fbe))
* **i18n** ds-742 component, test updates ([#428](https://github.com/quipucords/quipucords-ui/pull/428)) ([1b0ac5e](https://github.com/quipucords/quipucords-ui/commit/1b0ac5eb3c39880268e907059b6206bb00b43e33))
* **simpleDropdown** ds-742 simplify props, test updates ([#427](https://github.com/quipucords/quipucords-ui/pull/427)) ([7e05f7e](https://github.com/quipucords/quipucords-ui/commit/7e05f7e0cecd46df82d45f4da3301b134e1f581a))
* **notFound** ds-742 test, simplify, add translation ([#425](https://github.com/quipucords/quipucords-ui/pull/425)) ([c8aa20a](https://github.com/quipucords/quipucords-ui/commit/c8aa20a1b6bd103059213d4fd9d4ecd20750296d))
* **login** ds-356 migrate login to api hooks ([#420](https://github.com/quipucords/quipucords-ui/pull/420)) ([75a1ac1](https://github.com/quipucords/quipucords-ui/commit/75a1ac173cdba7648d7b2535ac5f291d842fb11a))
*  ds-716 delete unused locale strings ([#388](https://github.com/quipucords/quipucords-ui/pull/388)) ([cdb6819](https://github.com/quipucords/quipucords-ui/commit/cdb681953d8bae904cb98b8fd3b2daef09427185))
* **useSearchParam** ds-680 remove unused hook ([#382](https://github.com/quipucords/quipucords-ui/pull/382)) ([8d294ad](https://github.com/quipucords/quipucords-ui/commit/8d294ade8e3d88f00c3c7618cfbc7dbca3cb14e8))
*  base rewrite for typescript ([#390](https://github.com/quipucords/quipucords-ui/pull/390)) ([0750f54](https://github.com/quipucords/quipucords-ui/commit/0750f5482bbf16c5ff1dc0edaf638c23037970be))

### Chores
*  ds-783 remove unused empty logo assets  ([737289d](https://github.com/quipucords/quipucords-ui/commit/737289d172d05fc40b78a83b64ff5a098f4e6d84))

### Builds
* **deps** lock reset ([#520](https://github.com/quipucords/quipucords-ui/pull/520)) ([085d09a](https://github.com/quipucords/quipucords-ui/commit/085d09a77dcf53c9e9a228695ce45f7e4617b9ec))
*  bump quay.expires-after from 5d to 7d  ([4c7cdc2](https://github.com/quipucords/quipucords-ui/commit/4c7cdc2de1356858649d608e54baabaa355bcd3c))
* **deps** lock reset, update weldable from 3.1.3 to 3.2.0 ([#501](https://github.com/quipucords/quipucords-ui/pull/501)) ([7bd4e0d](https://github.com/quipucords/quipucords-ui/commit/7bd4e0df766fc3d3b00e1ee9ee4754ce0e01276b))
*  ds-776 move required packages to prod deps ([#449](https://github.com/quipucords/quipucords-ui/pull/449)) ([82cd550](https://github.com/quipucords/quipucords-ui/commit/82cd5504c144f13766f4db5c16e342d06cc996a5))
*  ds-775 integration checks moved to ci run only ([#448](https://github.com/quipucords/quipucords-ui/pull/448)) ([8d3bee9](https://github.com/quipucords/quipucords-ui/commit/8d3bee98df50f08ed666e34149bcc0f27edd9bb2))
*  ds-356 set default value for QUIPUCORDS_APP_PORT  ([a0b5d7f](https://github.com/quipucords/quipucords-ui/commit/a0b5d7fa87c698ce2b1d510f2ea4ac494d6bf4a8))
* **deps** lock reset ([#438](https://github.com/quipucords/quipucords-ui/pull/438)) ([aea9b3c](https://github.com/quipucords/quipucords-ui/commit/aea9b3c10ad45473a83708c847857fc20da86d87))
* **deps-dev** bump group with 12 updates ([#437](https://github.com/quipucords/quipucords-ui/pull/437)) ([ed07593](https://github.com/quipucords/quipucords-ui/commit/ed07593e6aad8855e4096adb961200e03c2bd795))
* **deps** bump group with 2 updates ([#435](https://github.com/quipucords/quipucords-ui/pull/435)) ([74c0731](https://github.com/quipucords/quipucords-ui/commit/74c0731bda962560402bce8cf755514a814fee19))
* **apiStage** update out-of-date scripting ([#417](https://github.com/quipucords/quipucords-ui/pull/417)) ([1b35dd6](https://github.com/quipucords/quipucords-ui/commit/1b35dd6488da108c48200d79229965196b8958fc))
* **deps-dev** bump weldable from 3.1.1 to 3.1.2 ([#416](https://github.com/quipucords/quipucords-ui/pull/416)) ([0d2a07b](https://github.com/quipucords/quipucords-ui/commit/0d2a07b363cc08fef3a4eb8d34ea827a9fbf324c))
* **deps** bump group with 4 updates ([#412](https://github.com/quipucords/quipucords-ui/pull/412)) ([a5658ba](https://github.com/quipucords/quipucords-ui/commit/a5658ba3d25d02ba9b96ed96a0dfe3a036aeba20))
* **deps-dev** bump cspell from 8.13.3 to 8.14.1 ([#408](https://github.com/quipucords/quipucords-ui/pull/408)) ([f563dee](https://github.com/quipucords/quipucords-ui/commit/f563deeb5acacab28c33f5da28d220bbf4847dac))
* **deps** bump group with 2 updates ([#407](https://github.com/quipucords/quipucords-ui/pull/407)) ([9dac7fe](https://github.com/quipucords/quipucords-ui/commit/9dac7fef56c37b6078e6647cfb67b67c2f7d1a5b))
* **deps-dev** bump group with 6 updates ([#404](https://github.com/quipucords/quipucords-ui/pull/404)) ([d72d78d](https://github.com/quipucords/quipucords-ui/commit/d72d78d6bb82824a50b8513a8d3ef263f4ad60e7))
* **deps** bump group with 2 updates ([#406](https://github.com/quipucords/quipucords-ui/pull/406)) ([88bc83f](https://github.com/quipucords/quipucords-ui/commit/88bc83f03cfa8c06315bb307b7d0ca0bb5dacc29))
* **deps** bump axios from 1.7.2 to 1.7.3 ([#403](https://github.com/quipucords/quipucords-ui/pull/403)) ([8d772d3](https://github.com/quipucords/quipucords-ui/commit/8d772d368cfc9c4d52a5c2b0502976e5245485de))
* **deps-dev** bump group with 5 updates ([#400](https://github.com/quipucords/quipucords-ui/pull/400)) ([bb1d29a](https://github.com/quipucords/quipucords-ui/commit/bb1d29af0bfa1585c2124daefd39a3b25d00862f))
* **deps** bump group with 14 updates ([#398](https://github.com/quipucords/quipucords-ui/pull/398)) ([29ee457](https://github.com/quipucords/quipucords-ui/commit/29ee457a0758d485ff08f8684239fabd153ebca4))
* **deps-dev** bump group with 9 updates ([#395](https://github.com/quipucords/quipucords-ui/pull/395)) ([7d93fad](https://github.com/quipucords/quipucords-ui/commit/7d93fad4aeeaf3a5cf5f67a4db31982ee4ea7c7a))
*  ds-627 prepare workflow for main branch ([#394](https://github.com/quipucords/quipucords-ui/pull/394)) ([488c012](https://github.com/quipucords/quipucords-ui/commit/488c01216f58e3b6ec0048e4dbe5a07ba53853eb))
* **Containerfile,Makefile** container build support ([#391](https://github.com/quipucords/quipucords-ui/pull/391)) ([a14637d](https://github.com/quipucords/quipucords-ui/commit/a14637dea688c1d7b1a0da0ba30ddaa16e97d38b))
*  ds-665 update, reset for refactor ([#389](https://github.com/quipucords/quipucords-ui/pull/389)) ([9260de1](https://github.com/quipucords/quipucords-ui/commit/9260de19bf86c877e96803e2ebad7b6bb00cf500))

### Bug Fixes
*  ds-839 block modal form submissions ([#517](https://github.com/quipucords/quipucords-ui/pull/517)) ([e9a6a5e](https://github.com/quipucords/quipucords-ui/commit/e9a6a5e51aa6a84555bd3901951304ee0c64926c))
* **views** ds-832 unselect items upon deletion  ([5fb3a2d](https://github.com/quipucords/quipucords-ui/commit/5fb3a2d20f4f0ddcddc39e693990758fd42be126))
* **sources** ds-436 wrap scan not run message in Button  ([a1949dc](https://github.com/quipucords/quipucords-ui/commit/a1949dc91657328a4622cea4e915ca3a8d53c550))
* **sources** ds-436 accept wider range of directories values  ([756fb7d](https://github.com/quipucords/quipucords-ui/commit/756fb7d5825599353b8a0a28f7984a294d298eca))
* **addSourcesScanModal** ds-436 deselect deep scan on close  ([7fb5b1f](https://github.com/quipucords/quipucords-ui/commit/7fb5b1f431da531d6c47c038f1ce860021a554dc))
* **showScansModal** ds-437 sort last scanned headers ([#502](https://github.com/quipucords/quipucords-ui/pull/502)) ([6fefc72](https://github.com/quipucords/quipucords-ui/commit/6fefc72c1053470e5e2e7d76729d1b06098ec339))
* **scans** ds-437 Prevent empty modal ([#499](https://github.com/quipucords/quipucords-ui/pull/499)) ([55efded](https://github.com/quipucords/quipucords-ui/commit/55efded8ccce97580b144a45c35f681264bf30c5))
* **showScansModal** ds-437 sort latest first  ([20a6e00](https://github.com/quipucords/quipucords-ui/commit/20a6e004643b6140027812668b0ba67680e37268))
*  ds-437 display start_time if no end_time  ([e43a836](https://github.com/quipucords/quipucords-ui/commit/e43a836c47c43ed799a334079fbae509f543010e))
* **sources** ds-436 display message if scan has not run yet ([#497](https://github.com/quipucords/quipucords-ui/pull/497)) ([995cc26](https://github.com/quipucords/quipucords-ui/commit/995cc2685c9bfd2d8776f302834bbb00783d10ed))
* **viewSourcesList** ds-813 useShowConnectionsApi catch errors ([#494](https://github.com/quipucords/quipucords-ui/pull/494)) ([92603dd](https://github.com/quipucords/quipucords-ui/commit/92603ddd04ee6149f10c8eda174093f8307704de))
*  ds-437 remove untreated errors ([#489](https://github.com/quipucords/quipucords-ui/pull/489)) ([dcd4f7e](https://github.com/quipucords/quipucords-ui/commit/dcd4f7e2eb85b8aef57a42399c389a423494b90f))
*  ds-441 use correct API field when sorting scans ([#491](https://github.com/quipucords/quipucords-ui/pull/491)) ([6a077df](https://github.com/quipucords/quipucords-ui/commit/6a077dfaae7fc79432c0f01bfd3fdefd2bb5fcb1))
* **sources** ds-503 accept wider range of hosts values  ([b1909a7](https://github.com/quipucords/quipucords-ui/commit/b1909a77b458f8be618dea023519fce1611a1230))
* **typeaheadCheckboxes** ds-436 Sync state w prop ([#476](https://github.com/quipucords/quipucords-ui/pull/476)) ([30cd594](https://github.com/quipucords/quipucords-ui/commit/30cd594a3f1e2f0adffc8e99b5421a8e10b487ce))
*  ds-438 add refetch interval to query helper ([#485](https://github.com/quipucords/quipucords-ui/pull/485)) ([21d441f](https://github.com/quipucords/quipucords-ui/commit/21d441f81f3969bf8d7b7310f6004ed7e868fa43))
* **scans,source** ds-437 ds-436 name filter, cred name ([#487](https://github.com/quipucords/quipucords-ui/pull/487)) ([9181f5e](https://github.com/quipucords/quipucords-ui/commit/9181f5eb714d5454f30bbbfa0fe824a2af085c60))
*  ds-436 Add OCP default port in form logic ([#484](https://github.com/quipucords/quipucords-ui/pull/484)) ([c5c83b7](https://github.com/quipucords/quipucords-ui/commit/c5c83b7fd17d9c8f38dff029de7793839301e502))
* **scans** ds-675 remove decision manager check ([#479](https://github.com/quipucords/quipucords-ui/pull/479)) ([6a08ef7](https://github.com/quipucords/quipucords-ui/commit/6a08ef79e0671dd380899ba5fc02e9770efdb282))
* **creds** ds-438 use consistent naming ([#477](https://github.com/quipucords/quipucords-ui/pull/477)) ([b3b5198](https://github.com/quipucords/quipucords-ui/commit/b3b51987807f08a7cfbdfb0b4d8c08e8c7fce172))
*  ds-356 login loading, error messages ([#469](https://github.com/quipucords/quipucords-ui/pull/469)) ([454c4ad](https://github.com/quipucords/quipucords-ui/commit/454c4adb6198f9ba67733fe23db33e53f2b8d63d))
* **test** ds-783 update title SVG assets  ([21c9802](https://github.com/quipucords/quipucords-ui/commit/21c980277c971a0757573c461c093efb3865797e))
*  ds-783 update title SVG assets  ([b74f413](https://github.com/quipucords/quipucords-ui/commit/b74f413a17804e5666e190f42f6f794a63060ddf))
* **creds,sources** ds-438 names inconsistency ([#457](https://github.com/quipucords/quipucords-ui/pull/457)) ([831cc78](https://github.com/quipucords/quipucords-ui/commit/831cc78ed57859e57b84a7ee67967c426cfb2d30))
* **scans** ds-437 remove redudant toast from scan ([#458](https://github.com/quipucords/quipucords-ui/pull/458)) ([3465306](https://github.com/quipucords/quipucords-ui/commit/3465306abbf8686be39763fc5181810298f0104b))
*  ds-356 axios response interceptors ([#442](https://github.com/quipucords/quipucords-ui/pull/442)) ([29ed194](https://github.com/quipucords/quipucords-ui/commit/29ed194c7561e31eb6aee6334b53a326875b6cb7))
* **credential** ds-438 use auth_type sent from api ([#455](https://github.com/quipucords/quipucords-ui/pull/455)) ([7dc6e10](https://github.com/quipucords/quipucords-ui/commit/7dc6e10793d1ba1445b3a0741bb02a1ee6c507dd))
* **creds,sources,scans** ds-438 update instructional text ([#444](https://github.com/quipucords/quipucords-ui/pull/444)) ([b53fdb0](https://github.com/quipucords/quipucords-ui/commit/b53fdb068e21ffbbcf34508dfc3f5c8bb62b0bf8))
* **credential** ds-391 correct rendered fields ([#441](https://github.com/quipucords/quipucords-ui/pull/441)) ([f156f8b](https://github.com/quipucords/quipucords-ui/commit/f156f8b2fd70a55eacbecc85e5f1e4c7f6c8c328))
* **credentials** ds-391 SSH key placeholder text ([#443](https://github.com/quipucords/quipucords-ui/pull/443)) ([6978a70](https://github.com/quipucords/quipucords-ui/commit/6978a705e013b4d36766ee51f9d50b636fbab561))
*  ds-391 render correct fields to add-cred network ([#436](https://github.com/quipucords/quipucords-ui/pull/436)) ([642a48e](https://github.com/quipucords/quipucords-ui/commit/642a48ed2c87302c274ec2dac2c706f18dedc24d))
*  ds-680 apply type on import ([#381](https://github.com/quipucords/quipucords-ui/pull/381)) ([743d86b](https://github.com/quipucords/quipucords-ui/commit/743d86b0ee70ff5d7fb910fee23e045852fb3721))
*  ds-716 errant comma, activate eslint for json ([#397](https://github.com/quipucords/quipucords-ui/pull/397)) ([f88fb84](https://github.com/quipucords/quipucords-ui/commit/f88fb84a66509650a677098ee6c6ed90805181e4))

## [1.9.0](https://github.com/quipucords/quipucords-ui/compare/ecfb69c27dd0344d75f8192adf72b19e71ef924d...8412af81f71f9afb62f715e7f86b21cb77ae62ee) (2024-12-02)


### Tests
*  ds-767 lower coverage thresholds  ([b9a82b8](https://github.com/quipucords/quipucords-ui/commit/b9a82b80c4e8ca3524fccd4570ab58e64134a5e2))
*  ds-523 introduce Camayoc PR testing  ([db649bb](https://github.com/quipucords/quipucords-ui/commit/db649bb543b4f2d9c81a448927a479b76fa9b1bc))
* **addSourceModal** ds-767 lint, test updates ([#446](https://github.com/quipucords/quipucords-ui/pull/446)) ([cc533bc](https://github.com/quipucords/quipucords-ui/commit/cc533bc1944c017569f1246a207c67a442b2b05c))
* **addSourcesScanModal** ds-767 lint, test updates ([#450](https://github.com/quipucords/quipucords-ui/pull/450)) ([62bbd97](https://github.com/quipucords/quipucords-ui/commit/62bbd975f810477f7529975768a46ccb3d1a9c54))
*  ds-767 ignore views from coverage ([#447](https://github.com/quipucords/quipucords-ui/pull/447)) ([d527630](https://github.com/quipucords/quipucords-ui/commit/d5276303dd9097313687118c3d56244709669509))
* **showSourceConnectionsModal** ds-742 lint, add tests ([#431](https://github.com/quipucords/quipucords-ui/pull/431)) ([87ae466](https://github.com/quipucords/quipucords-ui/commit/87ae466037cdb022d4c109f3efa1589ed422141f))
* **showScansModal** ds-742 lint, simplify test ([#430](https://github.com/quipucords/quipucords-ui/pull/430)) ([3c65718](https://github.com/quipucords/quipucords-ui/commit/3c6571860c9c84eb611fbcfe848a47c4665ff4fc))
* **typeaheadCheckboxes** ds-742 lint, basic test ([#429](https://github.com/quipucords/quipucords-ui/pull/429)) ([f3b2d85](https://github.com/quipucords/quipucords-ui/commit/f3b2d859aba21dbb23d43aa5cfdda41d202c0d46))
* **actionMenu** ds-742 lint, test updates ([#426](https://github.com/quipucords/quipucords-ui/pull/426)) ([55df3b0](https://github.com/quipucords/quipucords-ui/commit/55df3b0508023fc1f990ec9fc2abb14e0a40ca5e))
* **helpers** ds-742 snapshot, update link click error ([#424](https://github.com/quipucords/quipucords-ui/pull/424)) ([302e131](https://github.com/quipucords/quipucords-ui/commit/302e1319a52411b8c198d8881837cf875c49b9d9))
*  ds-742 remove typings, constants from coverage ([#423](https://github.com/quipucords/quipucords-ui/pull/423)) ([481aa9a](https://github.com/quipucords/quipucords-ui/commit/481aa9a1281cf9e93bd5d64ff2d49b84a9c4ab8d))
*  ds-356 adjust mock i18next to output string ([#422](https://github.com/quipucords/quipucords-ui/pull/422)) ([bd111cf](https://github.com/quipucords/quipucords-ui/commit/bd111cf9261ca472bf76909e32f7239f46ed4f3a))
*  ds-680 unit tests to hooks/useScanApi ([#381](https://github.com/quipucords/quipucords-ui/pull/381)) ([4af0050](https://github.com/quipucords/quipucords-ui/commit/4af00502ef3925eb257fdf41610550bc56ec806a))
*  ds-680 unit tests to hooks/useSourceApi  ([cd8abe9](https://github.com/quipucords/quipucords-ui/commit/cd8abe9674a1fca29f6c06e868c31618745d41f0))
*  ds-680 unit tests to hooks/useCredentialApi ([#379](https://github.com/quipucords/quipucords-ui/pull/379)) ([92f4b7d](https://github.com/quipucords/quipucords-ui/commit/92f4b7dfcf9348ea1d7e148434fa8ccb3ed76025))
*  ds-680 add unit tests to hooks/useAlerts ([#377](https://github.com/quipucords/quipucords-ui/pull/377)) ([ce068c2](https://github.com/quipucords/quipucords-ui/commit/ce068c2d9b8ec5785715d544f18fa009ad75941f))
*  ds-662 add unit tests to helpers module ([#368](https://github.com/quipucords/quipucords-ui/pull/368)) ([b27b830](https://github.com/quipucords/quipucords-ui/commit/b27b830a1b9acdba7ac1857e0288942888c649d1))

### Styles
* **credentials** ds-438 fix inconsistent style ([#456](https://github.com/quipucords/quipucords-ui/pull/456)) ([d0a7b69](https://github.com/quipucords/quipucords-ui/commit/d0a7b69cdcb07eba7df2d3137b6fef48e614a0ff))
* **cred,source,scan** ds-438  popup style fix ([#454](https://github.com/quipucords/quipucords-ui/pull/454)) ([1db100d](https://github.com/quipucords/quipucords-ui/commit/1db100d7eccf252cb6cc41a40d2d8210c00d3e46))
*  ds-647 file, linting consistency ([#390](https://github.com/quipucords/quipucords-ui/pull/390)) ([e340035](https://github.com/quipucords/quipucords-ui/commit/e340035697161ed148e05a42be21ecaca3a094b0))
*  file, linting consistency ([#390](https://github.com/quipucords/quipucords-ui/pull/390)) ([64ac3c4](https://github.com/quipucords/quipucords-ui/commit/64ac3c4ba48d5989a7ed5bc795d7790ab59a259c))

### Features
* **credential** ds-438 edit credential ([#507](https://github.com/quipucords/quipucords-ui/pull/507)) ([8412af8](https://github.com/quipucords/quipucords-ui/commit/8412af81f71f9afb62f715e7f86b21cb77ae62ee))
* **ActionMenu<Scan>** ds-437 add download report button ([#513](https://github.com/quipucords/quipucords-ui/pull/513)) ([23546f0](https://github.com/quipucords/quipucords-ui/commit/23546f0af3aeee22016e584ba158cea99e58d541))
* **login** ds-805 Display proper message on 403 response  ([3d49861](https://github.com/quipucords/quipucords-ui/commit/3d498612673e0faa1ef5981091038b2039faade9))
* **errorMessage** ds-809 creds, scans, sources messaging ([#490](https://github.com/quipucords/quipucords-ui/pull/490)) ([154014c](https://github.com/quipucords/quipucords-ui/commit/154014ca1b421e37d28f0a0240c9298a5b1a9322))
* **aboutModal** ds-808 display user, status info ([#488](https://github.com/quipucords/quipucords-ui/pull/488)) ([1bc3c89](https://github.com/quipucords/quipucords-ui/commit/1bc3c892155e0f04a0543bc7dc3ca0452f6e3270))
* **scans** ds-437 add close button to modal ([#478](https://github.com/quipucords/quipucords-ui/pull/478)) ([859471a](https://github.com/quipucords/quipucords-ui/commit/859471a2c413375939e6fe06b12c8556d89beee8))
*  ds-356 exclusively serve the current UI  ([9a0211d](https://github.com/quipucords/quipucords-ui/commit/9a0211d6c54ed3368b035a5655ded05bd5790318))
*  ds-504 add credential feature ([#414](https://github.com/quipucords/quipucords-ui/pull/414)) ([ef7cab9](https://github.com/quipucords/quipucords-ui/commit/ef7cab97445af767b151f853fad73f9e26c91aa3))

### Documentation
*  updates for current development strategy, resources ([#521](https://github.com/quipucords/quipucords-ui/pull/521)) ([3825c7c](https://github.com/quipucords/quipucords-ui/commit/3825c7c415ad8eb68d6604c0029e26d416ab0b3f))

### Continuous Integrations
*  ds-647 adjust gh workflow job names ([#396](https://github.com/quipucords/quipucords-ui/pull/396)) ([f3a4ac0](https://github.com/quipucords/quipucords-ui/commit/f3a4ac0cf193f9749e467f9a4514ffbafbcf1cbf))
*  ds-647 favor jest coverage report, remove codecov ([#391](https://github.com/quipucords/quipucords-ui/pull/391)) ([e9667f2](https://github.com/quipucords/quipucords-ui/commit/e9667f20b60fb74ecb1c342ba24b973de93c5bdf))
*  ds-647 reorder lint, build, test actions ([#391](https://github.com/quipucords/quipucords-ui/pull/391)) ([b81fb52](https://github.com/quipucords/quipucords-ui/commit/b81fb52ff627da895eef275b8b8ae943382e2055))

### Code Refactoring
*  ds-438 display items alphabetical order ([#486](https://github.com/quipucords/quipucords-ui/pull/486)) ([baf4808](https://github.com/quipucords/quipucords-ui/commit/baf48089426329a045c3f072868901a58dcddedb))
* **addSourceModal** align form state with credential form ([#460](https://github.com/quipucords/quipucords-ui/pull/460)) ([dcab39d](https://github.com/quipucords/quipucords-ui/commit/dcab39d99ba9e463e19da40dea6bc6f039a4ef56))
* **testing** DISCOVERY-523 Add attributes to aid UI tests ([#463](https://github.com/quipucords/quipucords-ui/pull/463)) ([c1a548a](https://github.com/quipucords/quipucords-ui/commit/c1a548a325465a8b63ce880bb558da802ccc8888))
*  ds-775 dotenv params for branding display ([#459](https://github.com/quipucords/quipucords-ui/pull/459)) ([b00c770](https://github.com/quipucords/quipucords-ui/commit/b00c77068cf31d74e9dd67172217bd553c514fbe))
* **i18n** ds-742 component, test updates ([#428](https://github.com/quipucords/quipucords-ui/pull/428)) ([1b0ac5e](https://github.com/quipucords/quipucords-ui/commit/1b0ac5eb3c39880268e907059b6206bb00b43e33))
* **simpleDropdown** ds-742 simplify props, test updates ([#427](https://github.com/quipucords/quipucords-ui/pull/427)) ([7e05f7e](https://github.com/quipucords/quipucords-ui/commit/7e05f7e0cecd46df82d45f4da3301b134e1f581a))
* **notFound** ds-742 test, simplify, add translation ([#425](https://github.com/quipucords/quipucords-ui/pull/425)) ([c8aa20a](https://github.com/quipucords/quipucords-ui/commit/c8aa20a1b6bd103059213d4fd9d4ecd20750296d))
* **login** ds-356 migrate login to api hooks ([#420](https://github.com/quipucords/quipucords-ui/pull/420)) ([75a1ac1](https://github.com/quipucords/quipucords-ui/commit/75a1ac173cdba7648d7b2535ac5f291d842fb11a))
*  ds-716 delete unused locale strings ([#388](https://github.com/quipucords/quipucords-ui/pull/388)) ([cdb6819](https://github.com/quipucords/quipucords-ui/commit/cdb681953d8bae904cb98b8fd3b2daef09427185))
* **useSearchParam** ds-680 remove unused hook ([#382](https://github.com/quipucords/quipucords-ui/pull/382)) ([8d294ad](https://github.com/quipucords/quipucords-ui/commit/8d294ade8e3d88f00c3c7618cfbc7dbca3cb14e8))
*  base rewrite for typescript ([#390](https://github.com/quipucords/quipucords-ui/pull/390)) ([0750f54](https://github.com/quipucords/quipucords-ui/commit/0750f5482bbf16c5ff1dc0edaf638c23037970be))

### Chores
*  ds-783 remove unused empty logo assets  ([737289d](https://github.com/quipucords/quipucords-ui/commit/737289d172d05fc40b78a83b64ff5a098f4e6d84))

### Builds
* **deps** lock reset ([#520](https://github.com/quipucords/quipucords-ui/pull/520)) ([085d09a](https://github.com/quipucords/quipucords-ui/commit/085d09a77dcf53c9e9a228695ce45f7e4617b9ec))
*  bump quay.expires-after from 5d to 7d  ([4c7cdc2](https://github.com/quipucords/quipucords-ui/commit/4c7cdc2de1356858649d608e54baabaa355bcd3c))
* **deps** lock reset, update weldable from 3.1.3 to 3.2.0 ([#501](https://github.com/quipucords/quipucords-ui/pull/501)) ([7bd4e0d](https://github.com/quipucords/quipucords-ui/commit/7bd4e0df766fc3d3b00e1ee9ee4754ce0e01276b))
*  ds-776 move required packages to prod deps ([#449](https://github.com/quipucords/quipucords-ui/pull/449)) ([82cd550](https://github.com/quipucords/quipucords-ui/commit/82cd5504c144f13766f4db5c16e342d06cc996a5))
*  ds-775 integration checks moved to ci run only ([#448](https://github.com/quipucords/quipucords-ui/pull/448)) ([8d3bee9](https://github.com/quipucords/quipucords-ui/commit/8d3bee98df50f08ed666e34149bcc0f27edd9bb2))
*  ds-356 set default value for QUIPUCORDS_APP_PORT  ([a0b5d7f](https://github.com/quipucords/quipucords-ui/commit/a0b5d7fa87c698ce2b1d510f2ea4ac494d6bf4a8))
* **deps** lock reset ([#438](https://github.com/quipucords/quipucords-ui/pull/438)) ([aea9b3c](https://github.com/quipucords/quipucords-ui/commit/aea9b3c10ad45473a83708c847857fc20da86d87))
* **deps-dev** bump group with 12 updates ([#437](https://github.com/quipucords/quipucords-ui/pull/437)) ([ed07593](https://github.com/quipucords/quipucords-ui/commit/ed07593e6aad8855e4096adb961200e03c2bd795))
* **deps** bump group with 2 updates ([#435](https://github.com/quipucords/quipucords-ui/pull/435)) ([74c0731](https://github.com/quipucords/quipucords-ui/commit/74c0731bda962560402bce8cf755514a814fee19))
* **apiStage** update out-of-date scripting ([#417](https://github.com/quipucords/quipucords-ui/pull/417)) ([1b35dd6](https://github.com/quipucords/quipucords-ui/commit/1b35dd6488da108c48200d79229965196b8958fc))
* **deps-dev** bump weldable from 3.1.1 to 3.1.2 ([#416](https://github.com/quipucords/quipucords-ui/pull/416)) ([0d2a07b](https://github.com/quipucords/quipucords-ui/commit/0d2a07b363cc08fef3a4eb8d34ea827a9fbf324c))
* **deps** bump group with 4 updates ([#412](https://github.com/quipucords/quipucords-ui/pull/412)) ([a5658ba](https://github.com/quipucords/quipucords-ui/commit/a5658ba3d25d02ba9b96ed96a0dfe3a036aeba20))
* **deps-dev** bump cspell from 8.13.3 to 8.14.1 ([#408](https://github.com/quipucords/quipucords-ui/pull/408)) ([f563dee](https://github.com/quipucords/quipucords-ui/commit/f563deeb5acacab28c33f5da28d220bbf4847dac))
* **deps** bump group with 2 updates ([#407](https://github.com/quipucords/quipucords-ui/pull/407)) ([9dac7fe](https://github.com/quipucords/quipucords-ui/commit/9dac7fef56c37b6078e6647cfb67b67c2f7d1a5b))
* **deps-dev** bump group with 6 updates ([#404](https://github.com/quipucords/quipucords-ui/pull/404)) ([d72d78d](https://github.com/quipucords/quipucords-ui/commit/d72d78d6bb82824a50b8513a8d3ef263f4ad60e7))
* **deps** bump group with 2 updates ([#406](https://github.com/quipucords/quipucords-ui/pull/406)) ([88bc83f](https://github.com/quipucords/quipucords-ui/commit/88bc83f03cfa8c06315bb307b7d0ca0bb5dacc29))
* **deps** bump axios from 1.7.2 to 1.7.3 ([#403](https://github.com/quipucords/quipucords-ui/pull/403)) ([8d772d3](https://github.com/quipucords/quipucords-ui/commit/8d772d368cfc9c4d52a5c2b0502976e5245485de))
* **deps-dev** bump group with 5 updates ([#400](https://github.com/quipucords/quipucords-ui/pull/400)) ([bb1d29a](https://github.com/quipucords/quipucords-ui/commit/bb1d29af0bfa1585c2124daefd39a3b25d00862f))
* **deps** bump group with 14 updates ([#398](https://github.com/quipucords/quipucords-ui/pull/398)) ([29ee457](https://github.com/quipucords/quipucords-ui/commit/29ee457a0758d485ff08f8684239fabd153ebca4))
* **deps-dev** bump group with 9 updates ([#395](https://github.com/quipucords/quipucords-ui/pull/395)) ([7d93fad](https://github.com/quipucords/quipucords-ui/commit/7d93fad4aeeaf3a5cf5f67a4db31982ee4ea7c7a))
*  ds-627 prepare workflow for main branch ([#394](https://github.com/quipucords/quipucords-ui/pull/394)) ([488c012](https://github.com/quipucords/quipucords-ui/commit/488c01216f58e3b6ec0048e4dbe5a07ba53853eb))
* **Containerfile,Makefile** container build support ([#391](https://github.com/quipucords/quipucords-ui/pull/391)) ([a14637d](https://github.com/quipucords/quipucords-ui/commit/a14637dea688c1d7b1a0da0ba30ddaa16e97d38b))
*  ds-665 update, reset for refactor ([#389](https://github.com/quipucords/quipucords-ui/pull/389)) ([9260de1](https://github.com/quipucords/quipucords-ui/commit/9260de19bf86c877e96803e2ebad7b6bb00cf500))

### Bug Fixes
*  ds-839 block modal form submissions ([#517](https://github.com/quipucords/quipucords-ui/pull/517)) ([e9a6a5e](https://github.com/quipucords/quipucords-ui/commit/e9a6a5e51aa6a84555bd3901951304ee0c64926c))
* **views** ds-832 unselect items upon deletion  ([5fb3a2d](https://github.com/quipucords/quipucords-ui/commit/5fb3a2d20f4f0ddcddc39e693990758fd42be126))
* **sources** ds-436 wrap scan not run message in Button  ([a1949dc](https://github.com/quipucords/quipucords-ui/commit/a1949dc91657328a4622cea4e915ca3a8d53c550))
* **sources** ds-436 accept wider range of directories values  ([756fb7d](https://github.com/quipucords/quipucords-ui/commit/756fb7d5825599353b8a0a28f7984a294d298eca))
* **addSourcesScanModal** ds-436 deselect deep scan on close  ([7fb5b1f](https://github.com/quipucords/quipucords-ui/commit/7fb5b1f431da531d6c47c038f1ce860021a554dc))
* **showScansModal** ds-437 sort last scanned headers ([#502](https://github.com/quipucords/quipucords-ui/pull/502)) ([6fefc72](https://github.com/quipucords/quipucords-ui/commit/6fefc72c1053470e5e2e7d76729d1b06098ec339))
* **scans** ds-437 Prevent empty modal ([#499](https://github.com/quipucords/quipucords-ui/pull/499)) ([55efded](https://github.com/quipucords/quipucords-ui/commit/55efded8ccce97580b144a45c35f681264bf30c5))
* **showScansModal** ds-437 sort latest first  ([20a6e00](https://github.com/quipucords/quipucords-ui/commit/20a6e004643b6140027812668b0ba67680e37268))
*  ds-437 display start_time if no end_time  ([e43a836](https://github.com/quipucords/quipucords-ui/commit/e43a836c47c43ed799a334079fbae509f543010e))
* **sources** ds-436 display message if scan has not run yet ([#497](https://github.com/quipucords/quipucords-ui/pull/497)) ([995cc26](https://github.com/quipucords/quipucords-ui/commit/995cc2685c9bfd2d8776f302834bbb00783d10ed))
* **viewSourcesList** ds-813 useShowConnectionsApi catch errors ([#494](https://github.com/quipucords/quipucords-ui/pull/494)) ([92603dd](https://github.com/quipucords/quipucords-ui/commit/92603ddd04ee6149f10c8eda174093f8307704de))
*  ds-437 remove untreated errors ([#489](https://github.com/quipucords/quipucords-ui/pull/489)) ([dcd4f7e](https://github.com/quipucords/quipucords-ui/commit/dcd4f7e2eb85b8aef57a42399c389a423494b90f))
*  ds-441 use correct API field when sorting scans ([#491](https://github.com/quipucords/quipucords-ui/pull/491)) ([6a077df](https://github.com/quipucords/quipucords-ui/commit/6a077dfaae7fc79432c0f01bfd3fdefd2bb5fcb1))
* **sources** ds-503 accept wider range of hosts values  ([b1909a7](https://github.com/quipucords/quipucords-ui/commit/b1909a77b458f8be618dea023519fce1611a1230))
* **typeaheadCheckboxes** ds-436 Sync state w prop ([#476](https://github.com/quipucords/quipucords-ui/pull/476)) ([30cd594](https://github.com/quipucords/quipucords-ui/commit/30cd594a3f1e2f0adffc8e99b5421a8e10b487ce))
*  ds-438 add refetch interval to query helper ([#485](https://github.com/quipucords/quipucords-ui/pull/485)) ([21d441f](https://github.com/quipucords/quipucords-ui/commit/21d441f81f3969bf8d7b7310f6004ed7e868fa43))
* **scans,source** ds-437 ds-436 name filter, cred name ([#487](https://github.com/quipucords/quipucords-ui/pull/487)) ([9181f5e](https://github.com/quipucords/quipucords-ui/commit/9181f5eb714d5454f30bbbfa0fe824a2af085c60))
*  ds-436 Add OCP default port in form logic ([#484](https://github.com/quipucords/quipucords-ui/pull/484)) ([c5c83b7](https://github.com/quipucords/quipucords-ui/commit/c5c83b7fd17d9c8f38dff029de7793839301e502))
* **scans** ds-675 remove decision manager check ([#479](https://github.com/quipucords/quipucords-ui/pull/479)) ([6a08ef7](https://github.com/quipucords/quipucords-ui/commit/6a08ef79e0671dd380899ba5fc02e9770efdb282))
* **creds** ds-438 use consistent naming ([#477](https://github.com/quipucords/quipucords-ui/pull/477)) ([b3b5198](https://github.com/quipucords/quipucords-ui/commit/b3b51987807f08a7cfbdfb0b4d8c08e8c7fce172))
*  ds-356 login loading, error messages ([#469](https://github.com/quipucords/quipucords-ui/pull/469)) ([454c4ad](https://github.com/quipucords/quipucords-ui/commit/454c4adb6198f9ba67733fe23db33e53f2b8d63d))
* **test** ds-783 update title SVG assets  ([21c9802](https://github.com/quipucords/quipucords-ui/commit/21c980277c971a0757573c461c093efb3865797e))
*  ds-783 update title SVG assets  ([b74f413](https://github.com/quipucords/quipucords-ui/commit/b74f413a17804e5666e190f42f6f794a63060ddf))
* **creds,sources** ds-438 names inconsistency ([#457](https://github.com/quipucords/quipucords-ui/pull/457)) ([831cc78](https://github.com/quipucords/quipucords-ui/commit/831cc78ed57859e57b84a7ee67967c426cfb2d30))
* **scans** ds-437 remove redudant toast from scan ([#458](https://github.com/quipucords/quipucords-ui/pull/458)) ([3465306](https://github.com/quipucords/quipucords-ui/commit/3465306abbf8686be39763fc5181810298f0104b))
*  ds-356 axios response interceptors ([#442](https://github.com/quipucords/quipucords-ui/pull/442)) ([29ed194](https://github.com/quipucords/quipucords-ui/commit/29ed194c7561e31eb6aee6334b53a326875b6cb7))
* **credential** ds-438 use auth_type sent from api ([#455](https://github.com/quipucords/quipucords-ui/pull/455)) ([7dc6e10](https://github.com/quipucords/quipucords-ui/commit/7dc6e10793d1ba1445b3a0741bb02a1ee6c507dd))
* **creds,sources,scans** ds-438 update instructional text ([#444](https://github.com/quipucords/quipucords-ui/pull/444)) ([b53fdb0](https://github.com/quipucords/quipucords-ui/commit/b53fdb068e21ffbbcf34508dfc3f5c8bb62b0bf8))
* **credential** ds-391 correct rendered fields ([#441](https://github.com/quipucords/quipucords-ui/pull/441)) ([f156f8b](https://github.com/quipucords/quipucords-ui/commit/f156f8b2fd70a55eacbecc85e5f1e4c7f6c8c328))
* **credentials** ds-391 SSH key placeholder text ([#443](https://github.com/quipucords/quipucords-ui/pull/443)) ([6978a70](https://github.com/quipucords/quipucords-ui/commit/6978a705e013b4d36766ee51f9d50b636fbab561))
*  ds-391 render correct fields to add-cred network ([#436](https://github.com/quipucords/quipucords-ui/pull/436)) ([642a48e](https://github.com/quipucords/quipucords-ui/commit/642a48ed2c87302c274ec2dac2c706f18dedc24d))
*  ds-680 apply type on import ([#381](https://github.com/quipucords/quipucords-ui/pull/381)) ([743d86b](https://github.com/quipucords/quipucords-ui/commit/743d86b0ee70ff5d7fb910fee23e045852fb3721))
*  ds-716 errant comma, activate eslint for json ([#397](https://github.com/quipucords/quipucords-ui/pull/397)) ([f88fb84](https://github.com/quipucords/quipucords-ui/commit/f88fb84a66509650a677098ee6c6ed90805181e4))

## [1.8.0](https://github.com/quipucords/quipucords-ui/compare/9be872b5fe7a7f734561bd56d54b6fa770f0f1e7...766c02aa4588a62deb2577a75caa31a8032b2ee4) (2024-05-30)


### Continuous Integrations
*  ds-661 dependabot groups for bulk updates ([#346](https://github.com/quipucords/quipucords-ui/pull/346)) ([11a892f](https://github.com/quipucords/quipucords-ui/commit/11a892fcefacf2d48e7dc653124b300f8fcd23d7))

### Code Refactoring
* **createScanDialog** ds-674 drop support for brms  ([91dd7eb](https://github.com/quipucords/quipucords-ui/commit/91dd7ebdffa0f9d46fcf017bd4b4e74883eb5248))
*  ds-390 remove pause, restart scans ([#350](https://github.com/quipucords/quipucords-ui/pull/350)) ([d040f9a](https://github.com/quipucords/quipucords-ui/commit/d040f9ac7b5ee142948378ad6d2ed8d1186e2fd6))

### Chores
* **deps** bump actions/cache from 3 to 4  ([e7b89b2](https://github.com/quipucords/quipucords-ui/commit/e7b89b2a2f5255abd1cafec2da84fcc735013862))

### Builds
*  ds-663 https for local staging ([#350](https://github.com/quipucords/quipucords-ui/pull/350)) ([c2bcac7](https://github.com/quipucords/quipucords-ui/commit/c2bcac708cec9e9f9c0953cc6bac2f3075cac290))
* **deps** ds-661 move to i18next-http-backend ([#362](https://github.com/quipucords/quipucords-ui/pull/362)) ([f8815d1](https://github.com/quipucords/quipucords-ui/commit/f8815d1ffb1051cdf29056605e785a36b3edbc52))
* **deps-dev** bump group with 2 updates ([#364](https://github.com/quipucords/quipucords-ui/pull/364)) ([8776248](https://github.com/quipucords/quipucords-ui/commit/8776248ea61f66087d9e082b9bcc81926ff93f71))
* **deps** bump react-redux ([#363](https://github.com/quipucords/quipucords-ui/pull/363)) ([879a6a7](https://github.com/quipucords/quipucords-ui/commit/879a6a71bf5c22268930dd845e19d358801e598a))
* **deps** ds-661 pf5 package updates ([#349](https://github.com/quipucords/quipucords-ui/pull/349)) ([92c48b2](https://github.com/quipucords/quipucords-ui/commit/92c48b2fb432a0bab5ccadb3d32fdf473ee59e5a))
* **deps** ds-661 npm updates ([#347](https://github.com/quipucords/quipucords-ui/pull/347)) ([0ec60db](https://github.com/quipucords/quipucords-ui/commit/0ec60dbdf8368ba5677717d6982804423bc648ab))
* **deps** ds-661 migrate to react 18 ([#347](https://github.com/quipucords/quipucords-ui/pull/347)) ([90a6be3](https://github.com/quipucords/quipucords-ui/commit/90a6be3c6951909a8ffdeae4b0601ab0dd456c3e))
*  ds-663 update local run, staging run for podman ([#345](https://github.com/quipucords/quipucords-ui/pull/345)) ([88b3dd5](https://github.com/quipucords/quipucords-ui/commit/88b3dd5bd073727ba634db3e5fdce9d24270ecc2))

### Bug Fixes
* **credentials** ds-681 hide token in network ([#369](https://github.com/quipucords/quipucords-ui/pull/369)) ([766c02a](https://github.com/quipucords/quipucords-ui/commit/766c02aa4588a62deb2577a75caa31a8032b2ee4))
* **viewToolbar** dsc-682 add missing types to filter  ([6863500](https://github.com/quipucords/quipucords-ui/commit/6863500f00cc243cff8e669e2f913422e3490ee4))
* **credentials** ds-205 disable edit for encrypted fields ([#367](https://github.com/quipucords/quipucords-ui/pull/367)) ([9a87cd4](https://github.com/quipucords/quipucords-ui/commit/9a87cd43b78d5d64721b59c275fda0c7cfebc688))
* **scans** ds-98 disable expandable sources ([#365](https://github.com/quipucords/quipucords-ui/pull/365)) ([f9f0305](https://github.com/quipucords/quipucords-ui/commit/f9f03053438614c098fc9942e41d83c0446f6bea))

## 1.6.3 (2024-02-07)


### Chores
*  add 'yarn audit' GitHub workflow  (3f79bc9)
* **deps-dev** bump mini-css-extract-plugin from 2.7.6 to 2.7.7  (#307) (3277868)
* **deps** bump codecov/codecov-action from 3.1.4 to 4.0.0  (#309) (4a7d81f)

### Bug Fixes
* **credentials** DISCOVERY-534 Don't try to update ro fields  (6533547)

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
