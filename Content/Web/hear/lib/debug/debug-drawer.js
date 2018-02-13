window.KinectGestures = window.KinectGestures ? window.KinectGestures : {};

(function () {
  function DebugDrawer() {
    let canvasEl = null,
      context = null;

    let record = false;

    var playerlost = false;

    let previousProximity = 1,
      previousX = 0,
      previousHandY = 0,
      previousHandX = 0,
      previousAngle = Math.PI / 2,
      previousHandZRight = 0,
      previousHandZLeft = 0;

    let previousplayer = 0;

    function update(frame) {
      if (frame.skeletons[previousplayer].trackingState < 2) {
        for (let iSkeleton = 0; iSkeleton < frame.skeletons.length; ++iSkeleton) {
          if (frame.skeletons[iSkeleton].trackingState === 2) {
            previousplayer = iSkeleton;
          }
        }
      }


      if (frame.skeletons[previousplayer].trackingState > 1) {
        updateSkeleton(frame.skeletons[previousplayer]).then((sums) => {
          playerlost = false;


          /************************** Proximité par rapport a la kinect **********************/
          let proximity = sums.z;
          let deltaProximity = proximity - previousProximity;
          // Si la variation de proximité est assez suffisante, on met à jour la police
          if (Math.abs(deltaProximity) > 0.2) {
            // Calcul de la valeur pour avoir une valeur cohérente sur le changeparam
            let value = Math.min(previousProximity + 0.05, Math.max(previousProximity - 0.05, proximity));
            //window.ptypoFont.changeParam('thickness', 45 *  (4 - value), window.text);
            previousProximity = value;
          }

          /*************************** Position X par rapport à la kinect ******************/
          let x = sums.x / sums.length;
          let dx = x - previousX;
          // Si la variation de position est assez suffisante, on met à jour la police
          if (Math.abs(dx) > 0.05) {
            value = Math.min(previousX + 0.02, Math.max(previousX - 0.02, x));
            //window.ptypoFont.changeParam('width', 0.75 *  (2 + value), window.text);
            previousX = value;
          }

          /*************************** Angle (se pencher) ******************/
          let angle = sums.angle;
          let da = angle - previousAngle;
          // Si la variation d'angle' est assez suffisante, on met à jour la police
          if (Math.abs(da) > Math.PI / 80) {
            value = Math.min(Math.PI / 2 + Math.PI / 2.8, Math.max(Math.PI / 2 - Math.PI / 2.8, Math.min(previousAngle + Math.PI / 120, Math.max(previousAngle - Math.PI / 120, da))));
            //window.ptypoFont.changeParam('slant', 90 - value * (180 / Math.PI),  window.text);
            previousAngle = value;
          }

          /*************************** Ecart (Haut/Bas) des mains ***********************/
          let handsy = sums.yhands;
          let deltahandsy = handsy - previousHandY;
          // Si la variation est assez suffisante, on met à jour la police
          if (Math.abs(deltahandsy) > 0.05) {
            value = handsy;
            window.ptypoFont.changeParam('xHeight', ((value * 500) + 350), window.text);
            previousHandY = value;
          }

          /*************************** Ecart (Gauche/Droite) des mains ***********************/
          let handsx = sums.xhands;
          let deltahandsx = handsx - previousHandX;
          // Si la variation est assez suffisante, on met à jour la police
          if (Math.abs(deltahandsx) > 0.05) {
            value = handsx;
            window.ptypoFont.changeParam('width', (value * 3), window.text);
            previousHandX = value;
          }


          /*************************** Proximité main droite ***********************/
          let handzright = sums.zhandright;
          let deltahandzright = handzright - previousHandZRight;
          // Si la variation est assez suffisante, on met à jour la police
          if (Math.abs(deltahandzright) > 0.05) {
            value = handzright;
            //window.ptypoFont.changeParam((value * 600) + 80, 'ascender', window.text);;
            previousHandZRight = value;
          }

          /*************************** Proximité main gauche ***********************/
          let handzleft = sums.zhandleft;
          let deltahandzleft = handzleft - previousHandZLeft;
          // Si la variation est assez suffisante, on met à jour la police
          if (Math.abs(deltahandzleft) > 0.05) {
            value = handzleft;
            //window.ptypoFont.changeParam(-((value * 600) + 80), 'descender', window.text);;
            previousHandZLeft = value;
          }
        });
      }
      /*************************** Joueur perdu, on réinitialise ******************/
      else if (!playerlost) {
        playerlost = true;
        // Utilisation de reset par facilité, mais possibilité de tween paramètre par paramètre
        window.ptypoFont.reset();
      }

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
    }
    // Récupération des données du squelette
    function updateSkeleton(skeleton, index) {
      return new Promise((resolve, reject) => {
        // Z axis
        let sumz = skeleton.joints[3].position.z || 2;

        // X axis
        let sumx = 0;
        for (let iJoint = 0; iJoint < skeleton.joints.length; ++iJoint) {
          let joint = skeleton.joints[iJoint];
          sumx = sumx + joint.position.x;
        }


        let yhands = Math.abs(skeleton.joints[7].position.y - skeleton.joints[11].position.y);
        let xhands = Math.abs(skeleton.joints[7].position.x - skeleton.joints[11].position.x);
        let zhandright = Math.abs(skeleton.joints[11].position.z - skeleton.joints[3].position.z) || 0;
        let zhandleft = Math.abs(skeleton.joints[7].position.z - skeleton.joints[3].position.z) || 0;

        //angle
        let angle = 0;
        if (skeleton.joints[3].trackingState === 2 && skeleton.joints[0].trackingState === 2) {
          angle = Math.atan2(skeleton.joints[3].position.y - skeleton.joints[0].position.y, skeleton.joints[3].position.x - skeleton.joints[0].position.x);
        } else {
          angle = Math.PI / 2;
        }

        resolve({
          x: sumx,
          z: sumz,
          xhands,
          yhands,
          zhandright,
          zhandleft,
          length: skeleton.joints.length,
          angle,
        });
      });
    }

    return {
      update: update
    };
  }

  KinectGestures.DebugDrawer = DebugDrawer();

})(window);