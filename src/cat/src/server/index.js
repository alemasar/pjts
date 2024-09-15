// import CatHooks from '@cat/cat-classes/CatHooks'
import CatContext from '@cat/cat-classes/CatContext';
class Server {
    constructor() {
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        console.log('CONSTRUCTOR SERVER');
        const context = CatContext.instance;
        this.url = new URL(document.location.href);
        console.log(this.url.pathname.replace('/', ''));
        console.log(context.getRouteNameByRoute(this.url.pathname));
    }
}
const serverPromise = new Promise((resolve, reject) => {
    // This Promise resolves to a string
    try {
        setTimeout(async () => {
            resolve(function () {
                const serverClass = new Server();
                console.log('INDEX FROM CAT SERVER', serverClass);
            });
        }, 500);
    }
    catch (e) {
        reject('ERROR FROM CAT SERVER');
    }
});
export default serverPromise;
