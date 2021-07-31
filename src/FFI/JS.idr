module FFI.JS

import Data.Vect

data Nullable : Type -> Type where [external]
export
data Element : Type where [external]
data Boolean : Type where [external]
export
data Array : (0 _: Nat) -> Type -> Type where [external]
export
data Tuple : Type -> Type -> Type where [external]

interface JS a where

JS a => JS (Nullable a) where
JS Element where
JS String where
JS Int where
JS Boolean where
JS a => JS (Array n a) where
(JS a, JS b) => JS (Tuple a b) where

interface ToJS a where
    toJS : JS b => a -> b


data Object : List (String, a) -> Type where [external]

export
(:::) : a -> b -> (a, b)
(:::) = (,)

%foreign "javascript:lambda:x => console.log(x)"
prim__consoleLog : String -> PrimIO ()

%foreign "javascript:lambda:x => document.getElementById(x)"
prim__getElementById : String -> PrimIO (Nullable Element)

%foreign "javascript:lambda:x => x === null"
prim__isNull : Nullable a -> Boolean

%foreign "javascript:lambda:x => x | 0"
prim__toInt : Boolean -> Int

%foreign "javascript:lambda:(i, a) => a[i]"
prim__index : Int -> Array n a -> Nullable a

%foreign "javascript:lambda:(i, a, x) => { a[i] = x; return a; }"
prim__setIndex : Int -> Array n a -> a -> Array n a

%foreign "javascript:lambda:n => new Array(n)" 
prim__newArray : Int -> Array n a 

%foreign "javascript:lambda:(x,y) => [x, y]"
prim__mkPair : a -> b -> Tuple a b

%foreign "javascript:lambda:([x, y]) => x"
prim__fst : Tuple a b -> a

%foreign "javascript:lambda:([x, y]) => y"
prim__snd : Tuple a b -> b

toBool : Boolean -> Bool
toBool x = 
    case prim__toInt x of
        0 => False
        _ => True

isNull : Nullable a -> Bool
isNull = toBool . prim__isNull

toMaybe : Nullable a -> Maybe a  
toMaybe x = 
    case isNull x of
        False => Just (believe_me x)
        True => Nothing 

intToNat : (x: Int) -> {auto 0 pf: x >= 0 = True} -> Nat
intToNat 0 = Z
intToNat x = S (intToNat {pf=believe_me ()} (x - 1))

export
index : (i: Int) -> {auto 0 gtz: i >= 0 = True} 
        -> {auto 0 ltn: intToNat i < n = True}
        -> Array n a -> Maybe a
index i arr = toMaybe $ prim__index i arr   

fromVect' : Vect n a -> Int -> Array m a -> Array m a 
fromVect' [] i a = a
fromVect' (x :: xs) i a = let a' = prim__setIndex i a x in fromVect' xs i a'

export
fromVect : Vect n a -> Array n a  
fromVect v = 
    let n = fromInteger . natToInteger $ length v in
    fromVect' v n (prim__newArray n) 
    
export
getElementById : String -> IO (Maybe Element)
getElementById el = map toMaybe $ primIO (prim__getElementById el)


export
toObject : ToJS a => (kvs: List (String, a)) -> Object kvs
toObject = ?toObjectImpl

export 
toPair : Tuple a b -> (a, b) 
toPair t = (prim__fst t, prim__snd t)

export
consoleLog : String -> IO ()
consoleLog = primIO . prim__consoleLog 
