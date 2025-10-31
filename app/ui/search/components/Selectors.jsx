import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { TbArrowsRandom } from "react-icons/tb";
import { BsChatQuote } from "react-icons/bs";

export const Selectors = () => {
    return (
        <div className="flex flex-row items-center gap-2 mr-2">
            <GiPerspectiveDiceSixFacesRandom title="Random Quote" size={25} className="text-gray-600 hover:text-pink-500 cursor-pointer" />
            <TbArrowsRandom title="Random Series Quote" size={23} className="text-gray-600 hover:text-pink-500 cursor-pointer" />
            <BsChatQuote title="Submit a Quote" size={23} className="text-gray-600 hover:text-pink-500 cursor-pointer" />
        </div>
    )
}