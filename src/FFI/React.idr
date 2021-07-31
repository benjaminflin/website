module FFI.React

import FFI.JS

data ReactElement : Type where [external]

ReactComponent : Type -> Type
ReactComponent props = props -> IO ReactElement

%foreign "javascript:lambda:(rel, el) => require('react-dom').render(rel, el)"
prim__render : Element -> ReactElement -> PrimIO ()

%foreign "javascript:lambda:(type, props, children) => require('react').createElement(type, props, children)"
prim__createNativeElement : String -> props -> Array n ReactElement -> ReactElement

%foreign "javascript:lambda:(type, props, children) => require('react').createElement(type, props, children)"
prim__createComponent : (props -> PrimIO (ReactElement)) -> props -> Array n ReactElement -> ReactElement

%foreign "javascript:lambda:initialState => require('react').useState(initialState)"
prim__useState : a -> PrimIO (Tuple a (a -> PrimIO ()))

createComponent : ReactComponent props -> props -> Array n ReactElement -> ReactElement 
createComponent comp props children = prim__createComponent (\props => toPrim $ comp props) props children 

export
useState : a -> IO (a, (a -> IO ()))
useState init = do 
    (state, prim__setState) <- toPair <$> primIO (prim__useState init)
    pure (state, primIO . prim__setState)

