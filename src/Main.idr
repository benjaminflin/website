module Main

import FFI.JS
import FFI.React

main : IO ()
main = do
    (s, setS) <- useState 0
    consoleLog "hello" 