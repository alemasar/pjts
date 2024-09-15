import server from '@cat-server/index';
import client from '@cat-client/index';
import CatHooks from '@cat/cat-classes/CatHooks';
const instanceHooks = CatHooks.instance;
const load = async () => {
    console.log('ENTOR EN LOAD');
    try {
        instanceHooks.callHookName('cat-client-before-load', {});
        instanceHooks.callHookName('cat-server-before-load', {});
        const returnValues = await Promise.all([server, client]);
        console.log(returnValues);
        for (const loadFunction of returnValues) {
            loadFunction();
        }
        instanceHooks.callHookName('cat-client-after-load', {});
        instanceHooks.callHookName('cat-server-after-load', {});
    }
    catch (e) {
        console.log('ERROR FROM CAT');
    }
};
export default async function () {
    console.log('INDEX FROM CAT');
    await load();
}
