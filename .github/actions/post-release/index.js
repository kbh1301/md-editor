const { setFailed } = require('@actions/core');
const { getOctokit } = require('@actions/github');

const owner = 'kbh1301';
const repo = 'md-editor';

run();

async function run() {
    try {
        const token = String(process.env.ACCESS_TOKEN);
        const releaseId = Number(process.env.RELEASE_ID);

        const octokit = getOctokit(token);
        const version = await getVersion();

        const releaseAssets = await octokit.request(
            `GET /repos/${owner}/${repo}/releases/${releaseId}/assets`,
        );
        const assets = releaseAssets.data;

        const latestJsonAsset = getAsset(assets, 'latest.json');

        console.log('getting latest.json contents...');
        const updater = await getAssetTextContent(token, latestJsonAsset);

        console.log('removing .sig assets...');
        await Promise.all(
            assets
                .filter((asset) => asset.name.endsWith('.sig'))
                .map((asset) =>
                    octokit.rest.repos.deleteReleaseAsset({
                        owner,
                        repo,
                        asset_id: asset.id,
                    }),
                ),
        );

        console.log('renaming release assets...');
        const macArmInstaller = getAsset(assets, 'aarch64.dmg');
        const macArmUpdater = getAsset(assets, 'aarch64.app.tar.gz');
        const macIntelInstaller = getAsset(assets, 'x64.dmg');
        const macIntelUpdater = getAsset(assets, 'x64.app.tar.gz');
        const windowsInstaller = getAsset(assets, '-setup.exe');
        const windowsUpdater = getAsset(assets, '-setup.nsis.zip');
        const linuxInstaller = getAsset(assets, 'amd64.AppImage');
        const linuxUpdater = getAsset(assets, 'amd64.AppImage.tar.gz');

        const macArmInstallerName = `md-editor_installer_mac_${version}_aarch64.dmg`;
        const macIntelInstallerName = `md-editor_installer_mac_${version}_x64.dmg`;
        const windowsInstallerName = `md-editor_installer_win_${version}_x64-setup.exe`;
        const linuxInstallerName = `md-editor_installer_nix_${version}_amd64.AppImage`;

        const macArmInstallerLabel = `md-editor installer for Mac (Apple Silicon)`;
        const macIntelInstallerLabel = `md-editor installer for Mac (Intel)`;
        const windowsInstallerLabel = `md-editor installer for Windows`;
        const linuxInstallerLabel = `md-editor installer for Linux (cross-distribution AppImage)`;

        const macArmUpdaterName = `md-editor_updater_mac_${version}_aarch64.app.tar.gz`;
        const macIntelUpdaterName = `md-editor_updater_mac_${version}_x64.app.tar.gz`;
        const windowsUpdaterName = `md-editor_updater_win_${version}_x64-setup.nsis.zip`;
        const linuxUpdaterName = `md-editor_updater_nix_${version}_amd64.AppImage.tar.gz`;

        renameUpdaterAsset(updater, 'darwin-aarch64', macArmUpdaterName);
        renameUpdaterAsset(updater, 'darwin-x86_64', macIntelUpdaterName);
        renameUpdaterAsset(updater, 'windows-x86_64', windowsUpdaterName);
        renameUpdaterAsset(updater, 'linux-x86_64', linuxUpdaterName);

        const newAssets = [
            {
                id: macArmInstaller.id,
                name: macArmInstallerName,
                label: macArmInstallerLabel,
            },
            {
                id: macArmUpdater.id,
                name: macArmUpdaterName,
            },
            {
                id: macIntelInstaller.id,
                name: macIntelInstallerName,
                label: macIntelInstallerLabel,
            },
            {
                id: macIntelUpdater.id,
                name: macIntelUpdaterName,
            },
            {
                id: windowsInstaller.id,
                name: windowsInstallerName,
                label: windowsInstallerLabel,
            },
            {
                id: windowsUpdater.id,
                name: windowsUpdaterName,
            },
            {
                id: linuxInstaller.id,
                name: linuxInstallerName,
                label: linuxInstallerLabel,
            },
            {
                id: linuxUpdater.id,
                name: linuxUpdaterName,
            },
        ];

        await Promise.all(
            newAssets.map(({ id, ...toUpdate }) =>
                octokit.rest.repos.updateReleaseAsset({
                    owner,
                    repo,
                    asset_id: id,
                    ...toUpdate,
                }),
            ),
        );

        console.log('publishing release...');
        await octokit.rest.repos.updateRelease({
            owner,
            repo,
            release_id: releaseId,
            draft: false,
        });



    } catch (error) {
        setFailed(error);
    }
}

async function getVersion() {
    const filePath = `package.json`;
    const contents = await readFile(filePath, 'utf-8');
    const json = JSON.parse(contents);
    return json.version;
}

async function getAssetTextContent(token, asset) {
    const octokit = getOctokit(token);
    const res = await octokit.request(
        `GET /repos/${owner}/${repo}/releases/assets/${asset.id}`,
        {
            headers: {
                Accept: 'application/octet-stream',
            },
        },
    );
    const contents = new TextDecoder('utf-8').decode(res.data);
    return JSON.parse(contents);
}

function getAsset(assets, endsWith) {
    const result = assets.find((o) => o.name.endsWith(endsWith));
    if (!result) {
        throw new Error(`No asset ends with: ${endsWith}`);
    }
    return result;
}

function renameUpdaterAsset(updater, platform, name,) {
    const oldUrl = updater.platforms[platform].url;
    const newUrl = `${path.parse(oldUrl).dir}/${name}`;
    updater.platforms[platform].url = newUrl;
}