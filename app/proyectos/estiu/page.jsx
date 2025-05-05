import Proyectos from '../../components/proyectos.jsx';
import BsnLayout from './layout.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';


export default function BsnPage() {
    return (
    <Inner>
    <BsnLayout>
        <Proyectos
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/v1746202740/Estiu_Desktop_dixbbf.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/v1746283412/Estiu_Mobile_1_cmggdr.mp4"

            cliente="Helados Estiu"
            tipo="Fotografía comercial"
            ano="2022"
            descripcion={ <>
                Helados Estiu confió en nosotros para realizar una sesión fotográfica de su línea de Mochis Helados, destacando cada sabor con ambientaciones únicas y modelos, para generar contenido visual impactante en redes sociales y campañas promocionales.
               </>}
            videoproyectomp4="https://res.cloudinary.com/ermostudio/video/upload/v1746283412/Estiu_Wrap_1_mjmuvt.mp4"
            explicacion={ <>
                Helados Estiu nos confió la creación de una sesión de fotografía comercial para destacar su línea de Mochis Helados, un producto que se vende internacionalmente bajo la marca <strong>WaoMochi</strong> y que, en España, forma parte de la marca propia de Mercadona, Hacendado.
                <br></br><br></br>
                Este proyecto tuvo como objetivo generar contenido visual para redes sociales y campañas promocionales, resaltando la esencia de cada sabor a través de imágenes únicas. Cada variedad recibió una ambientación personalizada: por ejemplo, el mochi de Mango utilizó tonalidades cálidas en naranjas y rojos, mientras que el de Té Matcha se acompañó de colores verdes y marrones suaves.
                <br></br><br></br>
                Para añadir un componente humano, involucramos modelos que interactuaron con los mochis, representando diferentes actings donde disfrutaban del producto. Cada modelo fue caracterizada para armonizar con la ambientación de cada sabor, logrando un resultado final visualmente impactante y alineado con la identidad del producto. 
            </>}

            image1mp4="https://res.cloudinary.com/ermostudio/video/upload/v1746283411/Estiu_mini_1_1_kpx49i.mp4"
            image2mp4="https://res.cloudinary.com/ermostudio/video/upload/v1746283411/Estiu_mini_2_1_zbbyri.mp4"
        ></Proyectos>
    </BsnLayout>
    </Inner>
    );
  }
  