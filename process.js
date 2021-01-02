var model;

async function loading()
{
  model = await tf.loadGraphModel('TFJS/model.json')
  // console.log(model);
}

function predictImage()
{
    // console.log('predict');
    let image = cv.imread(canvas);
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY)
    // image borders
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    //cropping image
    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    image = image.roi(rect) // region of interest

    var height = image.rows;
    var width = image.cols;

    if(height > width)
    {
      height = 20; //20*20 img 
      const factor = image.rows / height;
      width = Math.round(image.cols/factor);
    }else {
      width = 20;
      const factor = image.cols / width;
      height = Math.round(image.rows/factor);
    }

    let newSize = new cv.Size(width, height);
    //resize image
    cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);

    // add padding to get 28*28*1 size image
    const LEFT = Math.ceil((4+(20-width)/2));
    const RIGHT = Math.floor((4+(20-width)/2));
    const TOP = Math.ceil((4+(20-height)/2));
    const BOTTOM = Math.floor((4+(20-height)/2));

    // adding borders
    const BLACK = new cv.Scalar(0,0,0,0);
    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK)

    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);

    const cx = Moments.m10/Moments.m00; // x co-ordinate (com)
    const cy = Moments.m01/Moments.m00; // y co-ordinate (com)

    const X_SHIFT = Math.round((image.cols/2.0 - cx));
    const Y_SHIFT = Math.round((image.rows/2.0 - cy));

    newSize = new cv.Size(image.cols, image.rows);
    const M = cv.matFromArray(2,3, cv.CV_64FC1, [1,0, X_SHIFT, 0, 1, Y_SHIFT]);

    // image shift
    cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);
    
    //pixelate image
    let pixelValues = image.data;
    pixelValues = Float32Array.from(pixelValues);
    pixelValues = pixelValues.map(function (item){
        return item/255.0;
    });


    //tensor
    const X = tf.tensor([pixelValues]);
    // console.log(X.shape);
    const result = model.predict(X);
    result.print();

    //save output:
    const data = result.dataSync()[0];

    //Op image demo
    // const outputCanvas = document.createElement('canvas');
    // cv.imshow(outputCanvas, image);
    // document.body.appendChild(outputCanvas);

    // release objs
    image.delete();
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    M.delete();
    //tensor
    X.dispose();
    result.dispose();

    return data;
}