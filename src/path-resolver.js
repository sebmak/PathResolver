export default class PathResolver {
    static isObject = (o) => (
        typeof o == 'object' && Object.prototype.toString.call(o) === '[object Object]'
    );

    /*
     * Example usage
     *
     * Fetch path on obj, returning null if path DNE
     * resolvePath(obj, path);
     *
     * Fetch path on obj, returning '' if path DNE
     * resolvePath(obj, path, '');
     *
     * Set value on obj at path
     * resolvePath(obj, path, true, value);
     *
     * Recusively merge data at path on obj
     * resolvePath(obj, path, true, data, true);
     */
    static resolve = (...args) => {
        var argLength = args.length;

        if(argLength < 2) {
            throw 'resolvePath needs at least 2 arguments';
        }

        var object       = args[0];
        var path         = args[1];
        var data         = null;
        var defaultValue = null;

        // If there are 4 args, this is a 'set' call
        if(argLength == 4 || argLength == 5) {
            if(args[2] !== true) {
                throw 'The third argument is expected to be true for the set signature of resolvePath'
            }

            data   = args[3];
            var deep = false;
            if(argLength == 5) {
                deep = Boolean(args[4]);
            }
            var m = path.slice(1).split('/');
            var o = object;
            if(typeof o === 'undefined') {
                return o;
            }
            while(m.length) {
                var v = m.shift();
                if(m.length == 0) {
                    if(deep) {
                        if(this.isObject(o[v])) {
                            o[v] = Object.assign({}, o[v], data);
                            break;
                        }
                    }
                    o[v] = data;
                } else if(typeof o[v] === 'undefined') {
                    o[v] = {};
                }
                o = o[v];
            }

            return object;
        } else {
            // Otherwise, this is a 'get' call, in this case we allow an optional third
            // argument, which may specify a default value other than null when a node
            // doesn't exist alonag the desired path.
            if(argLength == 3) {
                defaultValue = args[2];
            }

            // Validation
            if(path.length < 1 || path[0] != '/') {
                throw 'Invalid path ' + path + ' supplied';
            }

            var k = path.slice(1).split('/');

            var o = object;
            if(typeof o === 'undefined') {
                return o;
            }

            for(var i = 0; i < k.length; i++) {
                if(typeof o[k[i]] !== 'undefined') {
                    o = o[k[i]];
                    continue;
                }
                return defaultValue;
            }
            return o;
        }
    }
}
