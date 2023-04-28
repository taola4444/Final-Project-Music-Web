import React, { useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import { actionType } from '../context/reducer';
import { useStateValue } from '../context/StateProvider';

const FilterButtons = ({edit,editFilterData, filterData, flag }) => {
  const [filterName, setFilterName] = useState(null);
  const [filterMenu, setFilterMenu] = useState(false);
  const [filterNameEdit, setFilterNameEdit] = useState(null);
  const [filterMenuEdit, setFilterMenuEdit] = useState(false);
  const [{roleFilter,filterTerm,artistFilter,languageFilter,albumFilter},dispath] = useStateValue();
  
  const updateFilterButton = (name) => {
    setFilterMenu(false);
    setFilterName(name);

    if(flag === "Artist"){
      dispath({
        type: actionType.SET_ARTIST_FILTER,
        artistFilter: name
      })
    }

    if(flag === "Album"){
      dispath({
        type: actionType.SET_ALBUM_FILTER,
        albumFilter: name
      })
    }

    if(flag === "Language"){
      dispath({
        type: actionType.SET_LANGUAGE_FILTER,
        languageFilter: name
      })
    }

    if(flag === "Category"){
      dispath({
        type: actionType.SET_FILTER_TERM,
        filterTerm: name
      })
    }

    if(flag === "Role"){
      dispath({
        type: actionType.SET_FILTER_ROLE,
        roleFilter: name
      })
    }
  }

  const updateFilterButtonEdit = (name) => {
    setFilterNameEdit(name);
    setFilterMenuEdit(false)
    if(flag === "Artist"){
      dispath({
        type: actionType.SET_ARTIST_FILTER,
        artistFilter: name
      })
    }

    if(flag === "Album"){
      dispath({
        type: actionType.SET_ALBUM_FILTER,
        albumFilter: name
      })
    }

    if(flag === "Language"){
      dispath({
        type: actionType.SET_LANGUAGE_FILTER,
        languageFilter: name
      })
    }

    if(flag === "Category"){
      dispath({
        type: actionType.SET_FILTER_TERM,
        filterTerm: name
      })
    }

    if(flag === "Role"){
      dispath({
        type: actionType.SET_FILTER_ROLE,
        roleFilter: name
      })
    }
  }

  return (
    <div className="relative inline-block text-left">
      {
        edit === "Edit" ? (
          <button onClick={() => setFilterMenuEdit(!filterMenuEdit)} type="button" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
            {!filterNameEdit && flag}
            <div>{editFilterData}</div>
            {filterNameEdit && (
              <>
                {
                  filterNameEdit.length > 15 ? `${filterNameEdit.slice(0, 14)}...` : filterNameEdit
                }
              </>
            )}
            <IoChevronDown className={`text-base text-textColor duration-150 transition-all ease-in-out ${filterMenuEdit ? "rotate-180" : "rotate-0"}`} />
          </button>
        ) : (
          <button onClick={() => setFilterMenu(!filterMenu)} type="button" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
            {!filterName && flag}
            {filterName && (
              <>
                {
                  filterName.length > 15 ? `${filterName.slice(0, 14)}...` : filterName
                }
              </>
            )}
            <IoChevronDown className={`text-base text-textColor duration-150 transition-all ease-in-out ${filterMenu ? "rotate-180" : "rotate-0"}`} />
          </button>
        )
      }
      
      {
        edit === "Edit" ? (
          (
            filterData && filterMenuEdit && (
              <div className="absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                {
                  filterData?.map((data) => (
                    <div key={data?.name} className="flex items-center gap-2 px-4 py-1 hover:bg-gray-200" role="none" onClick={() => updateFilterButtonEdit(data.name)}>
                      {
                        (flag === "Artist" || flag === "Album") && (
                          <img src={data.imageURL} className='w-8 min-w-[32px] h-8 rounded-full object-cover' />
                        )
                      }
                      <p className='w-full'>
                        {
                          data?.name?.length > 15 ? `${data.name.slice(0, 15)}...` : data.name
                        }
                      </p>
                    </div>
                  ))
                }
              </div>
            )     
          )
        ) : 
        (
          filterData && filterMenu && (
            <div className="absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
              {
                filterData?.map((data) => (
                  <div key={data?.name} className="flex items-center gap-2 px-4 py-1 hover:bg-gray-200" role="none" onClick={() => updateFilterButton(data.name)}>
                    {
                      (flag === "Artist" || flag === "Album") && (
                        <img src={data.imageURL} className='w-8 min-w-[32px] h-8 rounded-full object-cover' />
                      )
                    }
                    <p className='w-full'>
                      {
                        data?.name?.length > 15 ? `${data.name.slice(0, 15)}...` : data.name
                      }
                    </p>
                  </div>
                ))
              }
            </div>
          )     
        )
      }
    </div>
  )
}

export default FilterButtons; 