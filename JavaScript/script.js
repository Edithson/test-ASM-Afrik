$(document).ready(function () {
    let etablissements = [];
    let classes = [];
    let eleves = [];
    let currentEtablissementIndex = null;
    let currentClassIndex = null;

    function refreshTable() {
        const tbody = $("#etablissementsTable");
        tbody.empty();
        if (etablissements.length === 0) {
            tbody.append('<tr id="emptyMessage"><td colspan="4" class="text-center">Liste vide</td></tr>');
        } else {
            etablissements.forEach((etablissement, index) => {
                tbody.append(`
                    <tr>
                        <td>${etablissement.nom}</td>
                        <td>${etablissement.quartier}</td>
                        <td>${etablissement.dateCreation}</td>
                        <td>
                            <button class="btn btn-warning btn-sm editEtablissement" data-index="${index}">Modifier</button>
                            <button class="btn btn-danger btn-sm deleteEtablissement" data-index="${index}">Supprimer</button>
                        </td>
                    </tr>
                `);
            });
        }
    }

    $("#saveEtablissement").click(function () {
        $(".text-danger").addClass("d-none");
        const nom = $("#nom").val().trim();
        const quartier = $("#quartier").val().trim();
        const dateCreation = $("#dateCreation").val();

        if (!nom) $("#nom").next().removeClass("d-none");
        if (!quartier) $("#quartier").next().removeClass("d-none");
        if (!dateCreation) $("#dateCreation").next().removeClass("d-none");

        if (nom && quartier && dateCreation) {
            const editIndex = $("#editIndex").val();
            if (editIndex !== "") {
                etablissements[editIndex] = { nom, quartier, dateCreation };
            } else {
                etablissements.push({ nom, quartier, dateCreation });
            }

            $("#etablissementModal").modal("hide");
            $("#etablissementForm")[0].reset();
            $("#editIndex").val("");
            refreshTable();
        }
    });

    $(document).on("click", ".editEtablissement", function () {
        const index = $(this).data("index");
        currentEtablissementIndex = index;
        const etablissement = etablissements[index];
    
        $("#nom").val(etablissement.nom);
        $("#quartier").val(etablissement.quartier);
        $("#dateCreation").val(etablissement.dateCreation);
        $("#editIndex").val(index);
        $("#modalTitle").text("Modifier un établissement");
        $("#saveEtablissement").text("Modifier");
    
        refreshClassesTable();
    
        $("#etablissementModal").modal("show");
    });

    // Suppression d'un établissement
    $(document).on("click", ".deleteEtablissement", function () {
        const index = $(this).data("index");
    
        if (confirm("Voulez-vous vraiment supprimer cet établissement ?")) {
            etablissements.splice(index, 1);
            refreshTable();
        }
    });

    // Suppression d'un élève
    $(document).on("click", ".deleteStudent", function () {
        const index = $(this).data("index");
    
        if (confirm("Voulez-vous vraiment supprimer cet élève ?")) {
            eleves.splice(index, 1);
            refreshStudentsTable();
        }
    });
    

    $("#etablissementModal").on("hidden.bs.modal", function () {
        $("#modalTitle").text("Ajouter un établissement");
        $("#saveEtablissement").text("Enregistrer");
    });

    refreshTable();

    /// gestion des classes
    function refreshClassesTable() {
        const tbody = $("#classesTable");
        tbody.empty();

        const hasIdEtablissement1 = classes.some(classe => classe.id_etablissement == currentEtablissementIndex);
    
        if (!hasIdEtablissement1) {
            tbody.append('<tr id="emptyClassesMessage"><td colspan="4" class="text-center">Liste vide</td></tr>');
        } else {
            $.each(classes, function(index, classe) {
                if (classe.id_etablissement == currentEtablissementIndex) {
                    tbody.append(`
                        <tr>
                            <td>${classe.nom}</td>
                            <td>${classe.filiere}</td>
                            <td>${classe.professeur}</td>
                            <td>
                                <button class="btn btn-warning btn-sm editClass" data-index="${index}">Modifier</button>
                                <button class="btn btn-danger btn-sm deleteClass" data-index="${index}">Supprimer</button>
                            </td>
                        </tr>
                    `);
                }
            });
        }
    } 

    $("#saveClass").click(function () {
        $(".text-danger").addClass("d-none");
        const nom = $("#className").val().trim();
        const filiere = $("#classField").val().trim();
        const professeur = $("#classProfessor").val().trim();
        const id_etablissement = currentEtablissementIndex;
    
        if (!nom) $("#className").next().removeClass("d-none");
        if (!filiere) $("#classField").next().removeClass("d-none");
        if (!professeur) $("#classProfessor").next().removeClass("d-none");
    
        if (nom && filiere && professeur) {
            const editIndex = $("#classEditIndex").val();
            if (editIndex !== "") {
                classes[editIndex] = { nom, filiere, professeur, id_etablissement };
            } else {
                classes.push({ nom, filiere, professeur, id_etablissement });
            }
    
            $("#classModal").modal("hide");
            $("#classForm")[0].reset();
            $("#classEditIndex").val("");
            refreshClassesTable();
        }
    });
    

    $(document).on("click", ".editClass", function () {
        const index = $(this).data("index");
        currentClassIndex = index;
        const classe = classes[index];
        $("#className").val(classe.nom);
        $("#classField").val(classe.filiere);
        $("#classProfessor").val(classe.professeur);
        $("#classEditIndex").val(index);
        $("#classModalTitle").text("Modifier une classe");
        $("#saveClass").text("Modifier");
        $("#classModal").modal("show");

        refreshStudentsTable()
    });

    // Suppression d'une classe
    $(document).on("click", ".deleteClass", function () {
        const index = $(this).data("index");
    
        if (confirm("Voulez-vous vraiment supprimer cette classe ?")) {
            etablissements[currentEtablissementIndex].classes.splice(index, 1);
            refreshClassesTable();
        }
    });

    $("#classModal").on("hidden.bs.modal", function () {
        $("#classModalTitle").text("Ajouter une classe");
        $("#saveClass").text("Enregistrer");
    });

    refreshClassesTable();

    /// gestion des élèves

    function refreshStudentsTable() {
        
        const tbody = $("#studentsTable");
        tbody.empty();
        const hasIdClasse1 = eleves.some(eleve => eleve.id_classe == currentClassIndex);

        console.log(eleves);
        console.log(currentClassIndex);
        console.log(hasIdClasse1);
        if (!hasIdClasse1) {
            tbody.append('<tr id="emptyStudentsMessage"><td colspan="5" class="text-center">Liste vide</td></tr>');
        } else {
            $.each(eleves, function(index, eleve) {
                if (eleve.id_classe == currentClassIndex) {
                    tbody.append(`
                        <tr>
                            <td>${eleve.nom}</td>
                            <td>${eleve.prenom}</td>
                            <td>${eleve.dateNaissance}</td>
                            <td>${eleve.sexe}</td>
                            <td>
                                <button class="btn btn-warning btn-sm editStudent" data-index="${index}">Modifier</button>
                                <button class="btn btn-danger btn-sm deleteStudent" data-index="${index}">Supprimer</button>
                            </td>
                        </tr>
                    `);
                }
            });
        }
    }

    $(document).on("click", ".editStudent", function () {
        const index = $(this).data("index");
        const eleve = eleves[index];
    
        // Remplir les champs du formulaire avec les données existantes
        $("#studentName").val(eleve.nom);
        $("#studentFirstName").val(eleve.prenom);
        $("#studentBirthDate").val(eleve.dateNaissance);
        $("#studentGender").val(eleve.sexe);
        $("#studentEditIndex").val(index);
    
        // Mise à jour du titre du modal et du bouton d'action
        $("#studentModalTitle").text("Modifier un élève");
        $("#saveStudent").text("Modifier");
    
        // Afficher le modal
        $("#studentModal").modal("show");
    });
    
    
    $("#saveStudent").click(function () {
        $(".text-danger").addClass("d-none");
        const nom = $("#studentName").val().trim();
        const prenom = $("#studentFirstName").val().trim();
        const dateNaissance = $("#studentBirthDate").val();
        const sexe = $("#studentGender").val();
    
        if (!nom) $("#studentName").next().removeClass("d-none");
        if (!prenom) $("#studentFirstName").next().removeClass("d-none");
        if (!dateNaissance) $("#studentBirthDate").next().removeClass("d-none");
        if (!sexe) $("#studentGender").next().removeClass("d-none");
        const id_classe = currentClassIndex;
    
        if (nom && prenom && dateNaissance && sexe) {
            
            const editIndex = $("#studentEditIndex").val();
            if (editIndex !== "") {
                eleves[editIndex] = { nom, prenom, dateNaissance, sexe, id_classe };
            } else {
                eleves.push({ nom, prenom, dateNaissance, sexe, id_classe });
            }

            console.log(eleves)
    
            $("#studentModal").modal("hide");
            $("#studentForm")[0].reset();
            $("#studentEditIndex").val("");
            refreshStudentsTable();
        }

        
    });
    
    $("#studentModal").on("hidden.bs.modal", function () {
        $("#studentModalTitle").text("Ajouter un élève");
        $("#saveStudent").text("Enregistrer");
    });

});
