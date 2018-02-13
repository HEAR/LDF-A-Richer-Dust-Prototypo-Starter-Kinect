


$(document).ready(function () {

    // Texte choisi à afficher
    window.text = 'Hello HEAR'

    // Permet de récupérer les projets d'un compte prototypo
    window['prototypo-projects'].getProjects('email', 'password').then(function (fonts) {
        // Recherche la famille dans la liste de projets
        var family = fonts.find(function (font) {
            return font.name === 'familyname';
        });
        // Recherche la variante dans les variantes de la famille
        var variant = family && family.variants.find(function (variant) {
            return variant.name === 'variantname';
        });
        // Récupère les valeurs nécessaires à initialiser la police
        var template = family.template;
        var values = variant.values;
        var ptypoFont;

        var prototypo = new Ptypo.default('b1f4fb23-7784-456e-840b-f37f5a647b1c');
        // Crée une font 'testfont' en utilisant le template récupéré
        // la font 'testfont' a étée ajoutée à la page en css via une font-family
        prototypo.createFont('test-font', template).then(function(createdFont){
            // On ajoute la police créée dans le namespace window pour pouvoir la controler depuis lib/debug/debug-drawer.js
            window.ptypoFont = createdFont;
            // Change les paramètres de la font créée en utilisant les valeurs récupérées du compte
            window.ptypoFont.changeParams(values, window.text);

            // Modifie le texte de la page pour afficher le texte choisi
            $('#glyph').html(window.text);
        });


        // Le reste se passe dans lib/debug/debug-drawer.js


        /****************Librairie Prototypo **************/

        // createFont(fontName, fontTemplate)
        // crée une fonte 'fontName' utilisable en CSS via une balise font-family en utilisant le template 'fontTemplate'


        // ptypofont.changeParam(paramName, paramValue, subset)
        // Change le paramètre 'paramname' de la font 'ptypofont' en lui donnant la valeur 'paramValue';
        // Possibilité de limiter les caractères modifiés en donnant un 'subset' : chaîne de caractères, pas besoin que ça soit unique

        // ptypofont.changeParams(paramObj, subset)
        // Change les paramètres de la font 'ptypofont' selon l'objet de paramètres donné
        // {'thickness': 110, 'width': 1}
        // Possibilité de limiter les caractères modifiés en donnant un 'subset' : chaîne de caractères, pas besoin que ça soit unique


        // ptypofont.tween(paramName, paramValue, steps, aDuration, cb, subset)
        // Anime la fonte 'ptypofont' pendant 'aDuration' secondes en faisant varier 'steps' fois le 'paramName' jusqu'à 'paramValue'
        // Renvoie 'cb' (fonction) quand terminé
        // Possibilité de limiter les caractères modifiés en donnant un 'subset' : chaîne de caractères, pas besoin que ça soit unique

        // ptypofont.getArrayBuffer()
        // Renvoie l'arrayBufer de la font 'ptypofont'

        // ptypofont.reset(subset)
        // Réinitialise la font 'ptypofont' en lui redonnant les valeurs du template de base
        // Possibilité de limiter les caractères modifiés en donnant un 'subset' : chaîne de caractères, pas besoin que ça soit unique
    });




    var isSensorConnected = false;

    // Configuration des capteurs de la kinect
    var configuration = {

        "interaction" : {
            "enabled": false,
        },

        // Pour test : affichage du squelette
        "userviewer" : {
            "enabled": false,
            //"resolution": "640x480", //320x240, 160x120, 128x96, 80x60
            //"userColors": { "engaged": 0x7fffffff, "tracked": 0x7fffffff },
            //"defaultUserColor": 0x70000000, //RGBA 2147483647
        },

        // Fonction de supression du fond
        "backgroundRemoval" : {
            "enabled": false,
            //"resolution": "640x480", //1280x960
        },

        // Tracking du squelette
        "skeleton" : {
            "enabled": true,
        },

        "sensorStatus" : {
            "enabled": true,
        }

    };

    // Initialisation du capteur
    var sensor = Kinect.sensor(Kinect.DEFAULT_SENSOR_NAME, function (sensorToConfig, isConnected) {
        isSensorConnected = isConnected;
        sensorToConfig.postConfig(configuration);
    });

    sensor.addEventHandler(function (event) {

        switch (event.category) {
            case Kinect.SENSORSTATUS_EVENT_CATEGORY:
                switch (event.eventType) {
                    case Kinect.SENSORSTATUSCHANGED_EVENT_TYPE:
                    var connected = event.connected;
                    isSensorConnected = event.connected;
                        break;
                }
                break;
        }
    });

    // Kinect logics
    var GAME_STATUS = 'waiting';
        loggedPlayers = 0;

    KinectGestures.init(sensor,{
        debug:true,
        registerPlayer:false,
        canvasElementID:'skeletonContainer',
        log:false,
        logElementID:'skeletonLogger',
    });


    /****************************** GESTION DES GESTES KINECT ********************************/

    //KinectGestures.on(KinectGestures.EventType.PlayerTracked, function(event){});

    //KinectGestures.on(KinectGestures.EventType.PlayerEngagedAgain, function(event){});

    //KinectGestures.on(KinectGestures.GestureType.Wave, function(event){});

    //KinectGestures.on(KinectGestures.GestureType.Swipe, function(event){});

    //KinectGestures.on('squat',function(event){});
    //KinectGestures.on(KinectGestures.GestureType.SquatPosition, function(event){});
    //KinectGestures.on(KinectGestures.GestureType.Squat, function(event){});

    //KinectGestures.on(KinectGestures.GestureType.Jump, function(event){});
    //KinectGestures.on(KinectGestures.GestureType.JumpPosition, function(event){});
    //KinectGestures.on(KinectGestures.GestureType.JumpPositionHip, function(event){});

    // Si la caméra perds la personne
    KinectGestures.on(KinectGestures.EventType.PlayerLost, function(event){
        // On reset la font si la personne est perdue
        window.ptypoFont.reset();
    });

    //KinectGestures.on(KinectGestures.GestureType.PlayerPosition, function(event){});

});
