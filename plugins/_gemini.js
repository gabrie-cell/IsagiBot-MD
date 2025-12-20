importar fs desde 'fs'
ruta de importación desde 'ruta'
importar  { fileURLToPath } desde 'url'
 
const __filename = fileURLToPath ( importar.meta.url )
const __dirname = path.dirname ( __ filename )
 
const UA =  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/127.0.0.0 Safari/537.36'
 
deje que _fetch = globalThis.fetch
función asíncrona ensureFetch ( )  {
  si  ( tipo de _fetch ===  'función' )  devuelve _fetch
  const mod = await importación ( 'node-fetch' )
  _fetch = mod. predeterminado
  devolver _fetch
}
 
función btoa2 ( str )  {  devolver Buffer.from ( str , ' utf8' ) .toString ( 'base64 ' ) }  
función atob2 ( b64 )  {  devolver Buffer.from ( b64 , ' base64' ) . toString ( 'utf8' ) }  
 
función walkDeep ( nodo , visita , profundidad =  0 , profundidad máxima =  7 )  {
  si  ( profundidad > maxDepth )  devuelve
  si  ( visita ( nodo , profundidad )  ===  falso )  devolver
  si  ( Array . isArray ( nodo ) )  {
    para  ( const x del nodo ) walkDeep ( x , visita , profundidad +  1 , profundidad máxima )
  }  de lo contrario  si  ( nodo &&  tipo de nodo ===  'objeto' )  {
    para  ( const k de Object . keys ( nodo ) ) walkDeep ( nodo [ k ] , visita , profundidad +  1 , maxDepth )
  }
}
 
función cleanUrlCandidate ( s ,  { stripSpaces =  false  }  =  { } )  {
  si  ( typeof s !==  'string' )  devuelve  ''
  sea t = s
    . recortar ( )
    . reemplazar ( /^['"]|['"]$/g ,  '' )
    . reemplazar ( /\\u003d/gi ,  '=' )
    . reemplazar ( /\\u0026/gi ,  '&' )
    . reemplazar ( /\\u002f/gi ,  '/' )
    . reemplazar ( /\\\//g ,  '/' )
    . reemplazar ( /\\/g ,  '' )
    . reemplazar ( /[\\'"\]\)>,.]+$/g ,  '' )
  si  ( stripSpaces ) t = t. reemplazar ( /\s+/g ,  '' )
  devolver t
}
 
función looksLikeImageUrl ( u )  {
  devolver  /\.(png|jpe?g|webp|gif)(\?|$)/i . prueba ( u )  ||  /googleusercontent\.com|ggpht\.com/i . prueba ( u )
}
 
función asíncrona getAnonCookie ( )  {
  const f = await asegurarFetch ( )
  const r = esperar f (
    'https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=maGuAc&source-path=%2F&hl=es-ES&rt=c' ,
    {
      método :  'POST' ,
      redirigir :  'manual' ,
      encabezados :  {
        'tipo-contenido' :  'application/x-www-form-urlencoded;charset=UTF-8' ,
        'agente de usuario' : UA ,
      } ,
      cuerpo :  'f.req=%5B%5B%5B%22maGuAc%22%2C%22%5B0%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&' ,
    }
  )
 
  const setCookie = r.headers.get ( ' set - cookie' )
  if  ( ! setCookie )  throw  new Error ( 'Gemini no devolvió cookies (bloqueado o rate limit)' )
  devolver setCookie.split ( ' ;' ) [ 0 ]
}
 
función asíncrona getXsrfToken ( cookieHeader )  {
  intentar  {
    const f = await asegurarFetch ( )
    constante res = esperar f ( 'https://gemini.google.com/app' ,  {
      método :  'GET' ,
      encabezados :  {
        'agente de usuario' : UA ,
        galleta : encabezado de cookie ,
        aceptar :  'texto/html,aplicacion/xhtml+xml,aplicacion/xml;q=0.9,*/*;q=0.8' ,
      } ,
    } )
    const html = await res. texto ( )
    constante m1 = html.match ( /" SNlM0e ":"([^"]+)"/ )
    si  ( m1 ? . [ 1 ] )  devuelve m1 [ 1 ]
    constante m2 = html.match ( /"at":"([^"]+)" / )
    si  ( m2 ? . [ 1 ] )  devuelve m2 [ 1 ]
  }  atrapar  { }
  devolver  nulo
}
 
función extractImageUrlsFromText ( texto )  {
  constante out =  nuevo Conjunto ( )
  si  ( tipo de texto !==  'cadena'  ||  ! texto )  devolver  [ ]
  constante regex =  /https:\/\/[\w\-\.]+(?:googleusercontent\.com|ggpht\.com)[^\s"'<>)]+|https:\/\/[^\s"'<>)]+\.(?:png|jpe?g|webp|gif)(?:\?[^\s"'<>)]*)?/gi
  para  ( const m de ( texto. match ( regex )  ||  [ ] ) )  {
    constante u = cleanUrlCandidate ( m )
    si  ( /googleusercontent\.com\/image_generation_content\/0$/ . test ( u ) )  continuar
    fuera. añadir ( u )
  }
  devuelve  Array . desde ( salida )
}
 
función isLikelyText ( s )  {
  si  ( typeof s !==  'string' )  devuelve  falso
  constante t = s. trim ( )
  si  ( ! t )  devuelve  falso
  si  ( t. length  <  2 )  devuelve  falso
  si  ( /^https?:\/\//i . test ( t ) )  devuelve  falso
  si  ( /^\/\/www\./i . test ( t ) )  devuelve  falso
  si  ( /maps\/vt\/data/i . test ( t ) )  devuelve  falso
  si  ( /^c_[0-9a-f]{6,}$/i . test ( t ) )  devuelve  falso
  si  ( /^ [ A - Za - z0 - 9 _\ -+/= ] { 16 , } $ / . test ( t )  &&  !/ \s / . test ( t ) )  devuelve  falso
  si  ( /^\{.*\}$/ . test ( t )  ||  /^\[.*\]$/ . test ( t ) )  devuelve  falso
  si  ( /https?:\/\//i . test ( t )  && t. length  <  40 )  devuelve  falso
  devuelve t. longitud  >=  8  ||  /\s/ . prueba ( t )
}
 
función pickBestTextFromAny ( analizado )  {
  constante encontrada =  [ ]
  walkDeep ( analizado ,  ( n )  =>  {
    si  ( typeof n ===  'string  ' && isLikelyText ( n ) ) se encontró.push ( n.trim ( ) )
  } )
  encontrado.sort ( ( a , b ) = > b.longitud - a.longitud )  
  retorno encontrado [ 0 ]  ||  ''
}
 
función pickFirstString ( analizado , aceptar )  {
  deje primero =  ''
  walkDeep ( analizado ,  ( n )  =>  {
    si  ( primero )  devuelve  falso
    si  ( tipo de n !==  'cadena' )  devuelve
    constante t = n. trim ( )
    si  ( t &&  ( ! aceptar || aceptar ( t ) ) ) primero = t
    si  ( primero )  devuelve  falso
  } )
  regresa primero
}
 
función findInnerPayloadString ( exterior )  {
  candidatos constantes =  [ ]
 
  constante add =  ( s )  =>  {
    si  ( typeof s !==  'string' )  devuelve
    constante t = s. trim ( )
    si  ( ! t )  regresa
    candidatos. empujar ( t )
  }
 
  añadir ( exterior ? . [ 0 ] ? . [ 2 ] ) ; añadir ( exterior ? . [ 2 ] ) ; añadir ( exterior ? . [ 0 ] ? . [ 0 ] ? . [ 2 ] )
  walkDeep ( exterior ,  ( n )  =>  {
    si  ( tipo de n !==  'cadena' )  devuelve
    constante t = n. trim ( )
    si  ( ( t. comienza con ( '[' )  || t. comienza con ( '{' ) )  && t. longitud  >  20 ) agregar ( t )
  } ,  0 ,  5 )
 
  para  ( constantes de candidatos )  {
    intentar  {
      JSON. analizar ( es )
      retorno s
    }  atrapar  { }
  }
  devolver  nulo
}
 
función parseStream ( datos )  {
  if  ( typeof data !==  'string'  ||  ! data. trim ( ) )  throw  new Error ( 'Respuesta vacía de Gemini' )
  if  ( /<html|<!doctype/i . test ( data ) )  throw  new Error ( 'Gemini devolvió HTML (posible bloqueo).' )
 
  const chunks =  Array . de (
    datos.matchAll ( /^\d+\r?\n([\s\S] + ?)\r?\n(?=\d+\r?\n|$)/gm )
  ) .map ( m = > m [ 1 ] ) .reverse ( )
  if  ( ! chunks. length )  throw  new Error ( 'Respuesta inválida de Gemini (sin chunks)' )
 
  deje que mejor =  { texto :  '' , resumeArray :  null , analizado :  null  }
 
  para  ( const c de trozos )  {
    intentar  {
      constante externa = JSON.parse ( c )
      constante interna = findInnerPayloadString ( externa )
      si  ( ! interior )  continuar
      const parsed = JSON.parse ( interior )
 
      const text = pickBestTextFromAny ( analizado )
      const resumeArray =  Array . isArray ( analizado ? . [ 1 ] )  ? analizado [ 1 ]  :  null
 
      si  ( ! mejor. analizado )  {
        mejor =  { texto , resumeArray , analizado }
      }  de lo contrario  si  ( texto && texto. longitud  >  ( mejor. texto ? . longitud  ||  0 ) )  {
        mejor =  { texto , resumeArray , analizado }
      }
    }  atrapar  { }
  }
 
  if  ( ! best. parsed )  throw  new Error ( 'Respuesta inválida de Gemini (no parseable)' )
  const urls =  new Set ( extractImageUrlsFromText ( datos ) )
  walkDeep ( mejor analizado ,  ( n , profundidad )  =>  {
    si  ( profundidad >  6 )  devuelve  falso
    si  ( tipo de n !==  'cadena' )  devuelve
    constante u = cleanUrlCandidate ( n ,  { stripSpaces :  true  } )
    si  ( !/^ https : \ / \ //i.test(u)) devolver
    si  ( looksLikeImageUrl ( u ) ) urls.add ( u )
  } ,  0 ,  7 )
 
  deje que cleanText =  ( best. text  ||  '' ) . replace ( /\*\*(.+?)\*\*/g ,  '*$1*' ) . trim ( )
  si  ( ! texto limpio )  {
    constante aceptar =  ( t )  =>  {
      si  ( /^https?:\/\//i . test ( t ) )  devuelve  falso
      si  ( /^\/\/www\./i . test ( t ) )  devuelve  falso
      si  ( /maps\/vt\/data/i . test ( t ) )  devuelve  falso
      si  ( /^http:\/\/googleusercontent\.com\/image_collection\//i . test ( t ) )  devuelve  falso
      devuelve  verdadero
    }
    cleanText = pickFirstString ( mejor. analizado , aceptar )  || pickFirstString ( mejor. analizado )
      . reemplazar ( /\*\*(.+?)\*\*/g ,  '*$1*' )
      . recortar ( )
  }
 
  devolver  { texto : cleanText , resumeArray : best. resumeArray , imágenes :  Array . from ( urls )  }
}
 
exportar función asíncrona preguntar ( prompt , previousId =  null )  {
  const f = await asegurarFetch ( )
  if  ( typeof prompt !==  'string'  ||  ! prompt. trim ( ) )  throw  new Error ( 'Se requiere el prompt' )
 
  deje que resumeArray =  null
  si  ( previousId )  {
    intentar  {
      const j = JSON.parse ( atob2 ( previousId ) )
      resumeArray = j ? . resumeArray  ||  null
    }  atrapar  { }
  }
 
  deje que lastErr =  null
 
  para  ( deje que el intento =  1 ; el intento <=  3 ; el intento ++ )  {
    intentar  {
      constante cookie = await getAnonCookie ( )
      constante xsrf = await getXsrfToken ( cookie )
 
      carga útil constante =  [ [ prompt. trim ( ) ] ,  [ 'en-US' ] , resumeArray ]
      const fReq =  [ null , JSON.stringify ( carga útil ) ]
      constante params =  {  ' f.req' : JSON.stringify ( fReq ) } 
      si  ( xsrf ) parámetros. en  = xsrf
 
      respuesta constante = esperar f (
        'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?hl=es-ES&rt=c' ,
        {
          método :  'POST' ,
          encabezados :  {
            'tipo-contenido' :  'application/x-www-form-urlencoded;charset=UTF-8' ,
            'agente de usuario' : UA ,
            'x-mismo-dominio' :  '1' ,
            galleta ,
          } ,
          cuerpo :  nuevo URLSearchParams ( params ) ,
        }
      )
 
      si  ( ! respuesta. ok )  {
        const textBody = esperar respuesta.text ( ) . catch ( ( ) = > '' )  
        lanzar  nuevo Error ( `$ { response. status } $ { response. statusText } $ { textBody ||  '(cuerpo vacío)' } ` )
      }
 
      const data = esperar respuesta.texto ( )
      const parsed = parseStream ( datos )
      constante id = btoa2 ( JSON. stringify ( { resumeArray : parsed. resumeArray  } ) )
      return  { text : parsed. text , id , images : parsed. images  }
    }  captura  ( e )  {
      lastErr = e
      si  ( intento <  3 )  {
        esperar nueva Promesa ( r => setTimeout ( r ,  700 ) )
        continuar
      }
    }
  }
 
  lanzar últimoErr ||  nuevo error ( 'Error desconocido' )
}
 
exportar función asíncrona descargarImages ( urls , outDir = path.resolve ( __dirname , '..' , ' output' ) ) {   
  const f = await asegurarFetch ( )
  si  ( ! Array . isArray ( urls )  || urls. length  ===  0 )  devolver  [ ]
  si  ( outDir &&  ! fs.existeSync ( outDir ) ) fs.mkdirSync ( outDir , { recursivo : verdadero } )   
  const guardado =  [ ]
 
  para  ( const url de urls )  {
    intentar  {
      si  ( tipo de url !==  'cadena'  ||  !/^ https : \ / \ //i.test(url)) continuar
      constante baseHeaders =  {
        'agente de usuario' : UA ,
        aceptar :  'imagen/avif,imagen/webp,imagen/apng,imagen/*,*/*;q=0.8' ,
        'aceptar-idioma' :  'en-US,en;q=0.9' ,
      }
      deje que res = espere f ( url ,  { encabezados : baseHeaders } )
      si  ( ! res. ok ) res = await f ( url ,  { encabezados :  { ... baseHeaders , referente :  'https://gemini.google.com/'  }  } )
      si  ( ! res. ok )  continuar
 
      const buf = Buffer.from ( await res.arrayBuffer ( ) )
      const ct =  ( res. headers . get ( 'tipo-contenido' )  ||  '' ) . toLowerCase ( )
      constante extFromUrl =  /\.(png|jpe?g|webp|gif)(\?|$)/i . exec ( url ) ? . [ 1 ] ? . toLowerCase ( )
      constante ext =  ( extFromUrl
        ?  ( extFromUrl. comienza con ( 'jp' )  ?  'jpg'  : extFromUrl )
        :  ( ct. incluye ( 'png' )  ?  'png'  : ct. incluye ( 'webp' )  ?  'webp'  : ct. incluye ( 'gif' )  ?  'gif'  :  'jpg' ) )
 
      si  ( ! outDir )  continuar
      constante archivo = ruta.join ( outDir , ` gemini_ $ { Fecha.ahora ( ) } _ $ { Matemática.aleatorio ( ) . toString ( 36 ) .slice ( 2,7 ) } . $ { ext } ` ) 
      fs.writeFileSync ( archivo , buf )
      guardado.push ( archivo )
    }  atrapar  { }
  }
 
  retorno guardado
}
 
exportar función asíncrona askForImages ( prompt , previousId =  null , options =  { } )  {
  const outDir = opciones ? . outDir
  const resultado = await preguntar ( prompt , previousId )
  const imágenes =  Array . from ( new Set ( result. imágenes  ||  [ ] ) )
  const archivos = await downloadImages ( imágenes , outDir )
  devolver  { ... resultado , imágenes , archivos guardados : archivos }
}