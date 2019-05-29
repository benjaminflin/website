// stream takes an emitter which is a function which emit()'s values. The emit function is passed as a parameter to the emitter
export const stream = emitter => {
    let subscriptions = [];

    // pipe takes an operator. An operator takes an emitter and returns a stream (f: emitter -> stream)
    const pipe = op => {
        return op(emitter);
    };

    const subscribe = callback => {
        subscriptions.push(callback);
    };
    // the callback given is the emit() function passed to the emitter
    emitter(value => {
        subscriptions.forEach(callback => callback(value));
    });

    const unsubscribeAll = () => {
        subscriptions = [];
    };
    return {
        unsubscribeAll,
        subscribe,
        pipe
    };
};

// helper function which combines multiple streams
export const combine = (...streams) => {
    const emitter = emit => {
        streams.forEach(stream => stream.subscribe(emit));
    };
    return stream(emitter);
};

// operator which maps the values of one stream to another
export const map = fn => emitter =>
    stream(emit => {
        emitter(value => emit(fn(value)));
    });

// operator which groups events in ms
export const group = ms => emitter => {
    let queue = [];
    let timeout;
    stream(emit => {
        emitter(value => {
            queue.push(value);
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                emit(queue);
                queue = [];
            }, ms);
        });
    });
};

// operator which regularizes stream values to happen once every (ms)
export const ensureInterval = ms => emitter =>
    stream(_emit => {
        let lastTime = -1;
        let queue = [];

        // emit which resets time
        const emit = value => {
            _emit(value);
            lastTime = Date.now();
        };

        // flag used so that two emit loops cannot run at the same time
        let emitLoopRunning = false;

        const emitLoop = wait => {
            if (emitLoopRunning) return;

            emitLoopRunning = true;

            setTimeout(() => {
                emit(queue.pop());
                const interval = setInterval(() => {
                    if (queue.length === 0) {
                        clearInterval(interval);
                        emitLoopRunning = false;
                        return;
                    }
                    emit(queue.pop());
                }, ms);
            }, wait);
        };

        emitter(value => {
            const timeSinceLastEmit = Date.now() - lastTime;
            // emit value if enough time has passed
            if (timeSinceLastEmit >= ms) {
                emit(value);
            } else {
                // add to queue and run emit loop
                queue.unshift(value);
                emitLoop(ms - timeSinceLastEmit);
            }
        });
    });
