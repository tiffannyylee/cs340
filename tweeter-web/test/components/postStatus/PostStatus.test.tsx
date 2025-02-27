import { MemoryRouter } from "react-router-dom"
import PostStatus from "../../../src/components/postStatus/PostStatus"
import {render, screen} from "@testing-library/react"
import React from "react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {anything, capture, instance, mock, spy, verify, when} from "@typestrong/ts-mockito";

library.add(fab);

describe("PostStatus test", ()=>{
    it("When first rendered the Post Status and Clear buttons are both disabled.", ()=>{

    })
})

const renderPostStatus = () => {

}